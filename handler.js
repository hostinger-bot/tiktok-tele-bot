const { ttdl } = require('btch-downloader');
const tiktok_video = require('./plugins/tiktok_video');
const tiktok_photo = require('./plugins/tiktok_photo');

async function handler(bot, msg) {
  const From = msg.chat.id;
  const body = /^https?:\/\/(?:[\w-]+\.)?tiktok\.com\/.+/i;

  if (!body.test(msg.text || '')) return;

  const url = msg.text.trim();

  try {
    const data = await ttdl(url);

    if (!data || data.status !== true) {
      return bot.sendMessage(From, { text: 'Failed to retrieve TikTok data.' });
    }

    const videoArr = Array.isArray(data.video) ? data.video : [];
    const hasImages = Array.isArray(data.images) && data.images.length > 0;
    const firstUrl = videoArr[0];

    const isPhoto = hasImages || (
      videoArr.length > 0 &&
      typeof firstUrl === 'string' &&
      (firstUrl.includes('tplv-photomode') || /\.(jpe?g|png|webp)$/i.test(firstUrl))
    );

    if (isPhoto) {
      await tiktok_photo(bot, msg, data);
    } else if (videoArr.length > 0) {
      await tiktok_video(bot, msg, data);
    } else {
      await bot.sendMessage(From, { text: 'Media not found.' });
    }

  } catch (error) {
    await bot.sendMessage(From, { text: 'Failed to download TikTok, please try again later.' });
    console.error(`[TIKTOK ERROR] ${From}:`, error.message);
  }
}

module.exports = handler;
