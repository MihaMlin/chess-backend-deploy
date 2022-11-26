import nodemailer from "nodemailer";
//import keys from "./keys.json" assert { type: "json" };


var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    requireTLS: true,
    auth: {
        user: "rpo.chess2022@gmail.com",
        pass: keys.gmail_app_pass
    }
});


export const send_registration_mail = (customer_mail) => {
    var message = {
        from: '"rpo-chess" <rpo.chess2022@gmail.com>',
        to: customer_mail,
        subject: "Potrditev registracije",
        html: `
            Pozdravljeni,
            <br><br>
            ta e-naslov je bil uporabljen za registracijo na <b>chess-rpo</b>. Da lahko pričnete z igranjem, morate potrditi račun, z klikom na <i>xyz</i>.
            <br><br>
            Če se niste registrirali Vi, lahko ta mail ignorirate.
            <br><br>
            Veselo igranje :D`
    };
    
    transporter.sendMail(message, function(error, info){
        if(error){
            return console.log(error);
        }
    
        console.log("Message sent: " + info.response);
    });
};
