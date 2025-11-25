const sleep = require('../utils/sleep');

async function tiktok_photo(bot, msg, data) {
  const From = msg.chat.id;
  const { title = '', title_audio = '', video = [], audio = [], images = [] } = data;

  const caption = `Title: ${title}\nAudio: ${title_audio}`;
  const photoUrls = images.length > 0 ? images : video;

  try {
    const media = photoUrls.map((url, i) => ({
      type: 'photo',
      media: url,
      caption: i === 0 ? caption : undefined
    }));

    await bot.sendMediaGroup(From, media);
    await sleep(3000);

    if (audio[0]) {
      await bot.sendAudio(From, audio[0], {
        caption: `Audio: ${title_audio}`,
        reply_markup: {
          inline_keyboard: [[{ text: 'URL Audio', url: audio[0] }]]
        }
      });
      await sleep(3000);
    }

    await bot.sendMessage(From, 'Powered by @wtffry', {
      reply_markup: {
        inline_keyboard: [[{ text: 'Support', url: 'https://t.me/wtffry' }]]
      }
    });

  } catch (error) {
    await bot.sendMessage(From, { text: 'Sorry, an error occurred while sending the TikTok photo.' });
    console.error(`[PHOTO ERROR] ${From}:`, error.message);
  }
}

module.exports = tiktok_photo;
