const env = require('../.env');
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const bot = new Telegraf(env.token);

let data = {};
const permitedChars = /[!a-zA-Z0-9]/g ;


const buttons = list => Extra.markup(
  Markup.inlineKeyboard(
    list.map(item => Markup.callbackButton(item, `delete ${item}`)),
    {columns:3}
  )
)


bot.start(async context =>{
  const name = context.update.message.from.first_name;
  console.log(context.update.message.from)
  await context.reply(`Olá, ${name}!`);
  await context.reply('Escreva, um a um, os ítens que você deseja adicionar.');
})

bot.use((context, next) => {
  const chatID = context.chat.id;
  if (!data.hasOwnProperty(chatID)) data[chatID] = [];
  context.itens = data[chatID];
  next()
})

bot.command('add',(context,next)=>{
  let texto = context.update.message.text;
  permitedChars.test(texto) ? context.reply('Há 1 ou mais carateres inválidos.\n'+
  '\n'+
  'Eu só entendo números e letras de A a Z, em qualquer caixa.')
    : next(); 
}, context=>{
  let texto = context.update.message.text;
  if (texto.startsWith('/add ')) texto = texto.substring(5)
  context.itens.push(texto);
  context.reply(`${texto} adicionado!`, buttons(context.itens));
})

bot.action(/delete (.*)/, context => {
  const index = context.itens.indexOf(context.match[1]);
  if (index >= 0) context.itens.splice(index, 1);
  context.reply(`${context.match[1]} deletado!`, buttons(context.itens));
})

bot.startPolling();