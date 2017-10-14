/* eslint-disable new-cap */

const { ARRAY, BOOLEAN, STRING, Model } = require('sequelize');

const { instance: { db } } = require('../structures/PostgreSQL');
const Quiz = require('./Quiz');

class Guild extends Model { }

Guild.init(
	{
		id: {
			primaryKey: true,
			type: STRING('20')
		},
		prefixes: {
			type: ARRAY(STRING('32')),
			defaultValue: [],
			set: function setPrefixes(value) {
				this.setDataValue('prefixes', value.map(prefix => prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')));
			}
		},
		tamerRoleId: {
			field: 'tamer_role_id',
			type: STRING('20')
		},
		levelUpEnabled: {
			field: 'level_up_enabled',
			type: BOOLEAN,
			defaultValue: true
		},
		notificationChannelId: {
			field: 'notification_channel_id',
			type: STRING('20')
		},
		welcomeMessage: {
			field: 'welcome_message',
			type: STRING('1500')
		},
		farewellMessage: {
			field: 'farewell_message',
			type: STRING('1500')
		},
		selfRoleIds: {
			field: 'self_roles_ids',
			type: ARRAY(STRING('20')),
			defaultValue: []
		}
	},
	{
		createdAt: false,
		tableName: 'guilds',
		sequelize: db,
		updatedAt: false
	}
);

// Quizzes
Guild.hasOne(Quiz, { foreignKey: 'guildId' });

module.exports = Guild;
