import webpush from 'web-push';

const vapidKeys = webpush.generateVAPIDKeys();

console.log('=========================================');
console.log('NUEVAS LLAVES VAPID GENERADAS');
console.log('=========================================');
console.log('PUBLIC_KEY:');
console.log(vapidKeys.publicKey);
console.log('\nPRIVATE_KEY:');
console.log(vapidKeys.privateKey);
console.log('=========================================');
console.log('Copia estas llaves y guárdalas en un lugar seguro.');
