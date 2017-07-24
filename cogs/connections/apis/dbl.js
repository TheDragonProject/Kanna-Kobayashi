const superagent = require('superagent');
const { fakedbots } = require('../../../data/auth/keys');
const log = require('../../../util/log/bot');
const { client } = require('../discord');
const log1 = require('../../../util/log/error');

exports.start = async () =>
{	//const clientValues = await client.shard.fetchClientValues('guilds.size');
	//const totalGuilds = clientValues.reduce((prev, val) => prev + val, 0);
	setTimeout( () =>
	{	log('Posting server_count to Discord Bot List');
		superagent
		.post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
		.set('Authorization', fakedbots)
		.send({	server_count : totalGuilds	})
		.then( () =>
		{	log('Sucessfully posted server_count to Discord Bot List');	})
		.catch(e => log(e.stack));	}, 1800000);	}