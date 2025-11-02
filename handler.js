const { ttdl } = require('btch-downloader');
const tiktok_video  = require('./plugins/tiktok_video');
const tiktok_photo = require('./plugins/tiktok_photo');

async function handler(bot, msg) {
  const From = msg.chat.id;
  const body = /^https:\/\/(?:[\w-]+\.)?tiktok\.com\/.+/;

  if (body.test(msg.text)) {
    const url = msg.text;
    try {
      const data = await ttdl(url);
      const isPhoto = data.video[0].includes('tplv-photomode') || data.video[0].endsWith('.jpeg') || data.video[0].endsWith('.jpg');

      if (isPhoto) {
        await tiktok_photo(bot, msg, data);
      } else {
        await tiktok_video(bot, msg, data);
      }
    } catch (error) {
      await bot.sendMessage(From, 'Sorry, an error occurred while downloading the TikTok content.');
      console.error(`[ ERROR ] ${From}: ${error.message}`);
    }
  }
}

module.exports = handler