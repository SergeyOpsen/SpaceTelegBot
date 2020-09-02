require('dotenv').config()
const { Telegraf, Extra } = require('telegraf');
const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'borderradius59072',
  database : 'planets_info'

});

 connection.connect((err)=>{
    if(err){
        throw err;
    }
    console.log("Mysql Starter...");
 });
 
const Markup = require("telegraf/markup");
const { resize } = require('telegraf/markup');
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log('Response time: %sms', ms);
    console.log('Response time: %sms', start);
    console.log(`First name:${ctx.message.from.first_name}
    Last name:${ctx.message.from.last_name}
    Text:${ctx.message.text}`);
  });
bot.start((ctx) => ctx.reply(`Hi! ${ctx.message.from.first_name} ${ctx.message.from.last_name}Welcome,Into a space bot, here you can 
find out information about different planets. If you have any questions /help is always to help!`,
Markup.keyboard(
    [
        ["/help","Exoplanets"],
        ["The planets of the solar system"]
    ])
    .resize()
    .extra()
    )+ctx.replyWithVideo({source:"img/Start/tenor.gif"}));
bot.help((ctx) => { 
ctx.reply(`Hello Galaxy Traveler,
👩‍🚀! I am a space bot, if there is a desire to find out information about 
the planets of the solar system or about exoplanets, then I will be happy to help! 🌌`)+ctx.replyWithPhoto({source:"img/Help/fon.jpg"})});
bot.hears("The planets of the solar system", (ctx) => {
    let solarPlanets = [];
    let sql = "SELECT Planet FROM listplanet LIMIT 8"
    connection.query(sql, (err, result) => {
        console.log(result);
        let index = 0;
    for(i=0;i<=2;i++){
        solarPlanets[i]=[];
            for(j=0;j<=2;j++){
                if(index<8){
                solarPlanets[i][j]=result[index].Planet;
                index++;
                }
                else
                {
                    solarPlanets[i][j]="Back";
                }
            }
        }
    
    console.log(solarPlanets);
    ctx.reply(`Why Is It Called The "Solar" System?
There are many planetary systems like ours in the universe, with planets orbiting a host star. Our planetary system is named 
the "solar" system because our Sun is named Sol, after the Latin word for Sun, "solis," and anything related to the Sun we call "solar."
The planets of the solar system`,
Markup.keyboard(  
    
    solarPlanets
    )
    .resize()
    .extra()
)+ctx.replyWithPhoto({source:"img/SolarPlanets/solar_system.jpg"})})});
bot.hears("Back", (ctx) => ctx.reply("Home page:",
Markup.keyboard(
    [
        ["/help","Exoplanets"],
        ["The planets of the solar system"]
    ])
    .resize()
    .extra()
));
bot.hears("Exoplanets", (ctx) => {
    let exoPlanets = [];
    let sql = "SELECT Planet,MAX(ID) FROM listplanet GROUP BY Planet HAVING MAX(ID)>8"
    connection.query(sql, (err, result) => {
        console.log(result);
        let index = 0;
    for(i=0;i<=9;i++){
        exoPlanets[i]=[];
            for(j=0;j<=2;j++){
                if(index<29){
                exoPlanets[i][j]=result[index].Planet;
                index++;
                }
                else
                {
                    exoPlanets[i][j]="Back";
                }
            }
        }
    
    console.log(exoPlanets);
    ctx.reply("Exoplanets:",
Markup.keyboard(exoPlanets)
    .resize()
    .extra()
)})});
bot.on("text", (ctx) => { 
    let sql = "SELECT * FROM listplanet WHERE Planet ="+connection.escape(ctx.message.text);
    connection.query(sql,(err,result)=>{
         if(err) throw err;
         let planet = result[0];
         if(planet===undefined || planet=== null)
         return;
         
         ctx.reply(planet.Description)+ctx.replyWithPhoto({source:`img/${planet.img}`});
     });
    });
//сканер ошибок
bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
  })
  bot.start((ctx) => {
    throw new Error('Example error');
  })
  bot.launch();