import { Message } from 'discord.js';
import { duration } from 'moment';

import { User as UserModel } from '../../models/User';
import { Command } from '../../structures/Command';
import { CommandHandler } from '../../structures/CommandHandler';
import { MessageEmbed } from '../../structures/MessageEmbed';
import { Beatmap, Score } from '../../structures/osu';
import { ICommandRunInfo } from '../../types/ICommandRunInfo';
import { OsuMode } from '../../types/osu/OsuMode';

class OsuBeatmapCommand extends Command {
	public constructor(handler: CommandHandler) {
		super(handler, {
			aliases: ['beatmap', 'osuset', 'set'],
			coins: 0,
			exp: 0,
			usage: 'osubeatmap <ID> [Mode] [\'best\']',
			description: 'See how much time it takes me to receive your message!',
			name: 'osubeatmap',
			examples: ['osubeatmap 577427', 'osubeatmap 577427 best', 'osubeatmap 577427 taiko best'],
		});

	}

	public parseArgs(
		message: Message,
		[id, modeOrOption, option]: string[],
	): [string, OsuMode, string] | string {
		if (!id) return 'you have to tell me what beatmap you want to lookup!';

		let mode: OsuMode = OsuMode.OSU;
		if (modeOrOption) {
			modeOrOption = modeOrOption.toUpperCase();
			// tslint:disable-next-line:no-any
			const tmpMode: OsuMode = OsuMode[modeOrOption as any] as any;
			if (tmpMode) mode = tmpMode;
			else option = modeOrOption;
		}

		return [id, mode, option];
	}

	public async run(
		message: Message,
		[id, mode, option]: [string, OsuMode, string],
		{ authorModel, commandName }: ICommandRunInfo,
	): Promise<Message | Message[]> {
		if (!commandName.includes('set')) {
			const best: boolean = option && option.toLowerCase() === 'best';

			const beatmap: Beatmap = await Beatmap.fetch(id, mode);

			if (!beatmap) {
				if (best) return message.reply('I could not find a beatmap with that id!');
			} else {
				return best
					? this.showBest(message, authorModel, beatmap)
					: this.showMap(message, authorModel, beatmap);
			}
		}

		const beatmaps: Beatmap[] = await Beatmap.fetchSet(id);

		if (!beatmaps) return message.reply('I could not find a beatmap nor set with that id!');

		return this.showSet(message, authorModel, beatmaps);
	}

	private formatLength(seconds: number): string {
		return duration(seconds, 'seconds').format('hh:mm:ss');
	}

	private async showBest(message: Message, authorModel: UserModel, beatmap: Beatmap): Promise<Message | Message[]> {
		const scores: Score[] = await beatmap.fetchBestScores();

		const embed: MessageEmbed = MessageEmbed.common(message, authorModel)
			.setAuthor(`${beatmap.artist} -- ${beatmap.title} [${beatmap.version}]`, undefined, beatmap.versionURL())
			.setThumbnail(beatmap.iconURL)
			.setDescription([
				`**Mode:** ${beatmap.mode}`,
				`**Stars:** ${beatmap.difficultyRating.toFixed(2)}`,
				`**CS:** ${beatmap.circleSize.toFixed(1)} **HP:** ${beatmap.healthDrain.toFixed(1)}`,
				`**OD:** ${beatmap.overallDifficulty.toFixed(1)} **AR:** ${beatmap.approachRate.toFixed(1)}`,
			]);

		for (const score of scores) {
			embed.addField(
				// Already there, resolved instantly
				`${(await score.fetchUser()).username} -- ${score.rank}`,
				[
					`**Mods:** ${score.enabledMods || 'None'}`,
					`**Accuracy:** ${(score.accuracy() * 100).toFixed(2)}%`,
					`**Score:** ${score.score.toLocaleString()}`,
					`**Combo:** ${score.maxCombo.toLocaleString()}x`,
					`**Performance**: ${score.pp.toLocaleString()}pp`,
				],
				true,
			);
		}

		return message.channel.send(embed);
	}

	private showMap(message: Message, authorModel: UserModel, beatmap: Beatmap): Promise<Message | Message[]> {
		const embed: MessageEmbed = MessageEmbed.common(message, authorModel)
			.setAuthor(`${beatmap.artist} -- ${beatmap.title} [${beatmap.version}]`, undefined, beatmap.versionURL())
			.setImage(beatmap.iconURL)

			.addField('Creator', beatmap.creator, true)
			.addField(
			'Stats',
			[
				`CS: ${beatmap.circleSize.toFixed(1)}`,
				`HP: ${beatmap.healthDrain.toFixed(1)}`],
			true)
			.addField(
			'\u200b',
			[
				`OD ${beatmap.overallDifficulty.toFixed(1)}`,
				`AR: ${beatmap.approachRate.toFixed(1)}`,
			],
			true)

			.addField('Tags', beatmap.tags || 'None')

			.addField('Difficulty', `${beatmap.difficultyRating.toFixed(2)} Stars`, true)
			.addField(
			'Length (Drain)',
			`${this.formatLength(beatmap.length)} (${this.formatLength(beatmap.playLength)})`,
			true)
			.addField('Passes | Plays', `${beatmap.passCount.toLocaleString()} | ${beatmap.playCount.toLocaleString()}`, true)

			.addField('BPM', beatmap.bpm, true)
			.addField('Language', beatmap.language, true)
			.addField('Genre', beatmap.genre, true)

			.addField('Favorites', beatmap.favoriteCount.toLocaleString(), true)
			.addField(
			'State',
			[
				`${beatmap.approved}`,
				beatmap.approvedAt ? `, as of:\n${beatmap.approvedAt.format('DD/MM/YYYY (hh:mm)')}` : '',
			].join(''),
			true)
			.addField('ID | Set ID', `${beatmap.id} | ${beatmap.setId}`, true);

		return message.channel.send(embed);
	}

	private showSet(message: Message, authorModel: UserModel, beatmaps: Beatmap[]): Promise<Message | Message[]> {
		const [first] = beatmaps;

		const embed: MessageEmbed = MessageEmbed.common(message, authorModel)
			.setAuthor(`${first.artist} -- ${first.title}`, undefined, first.setURL)

			.addField('Creator', first.creator, true)
			.addField('Language', first.language, true)
			.addField('Genre', first.genre, true)

			.addField('Tags', first.tags || 'none')

			.addField(
			'State',
			[
				`${first.approved}`,
				first.approvedAt ? `, as of:\n${first.approvedAt.format('DD/MM/YYYY (hh:mm)')}` : '',
			].join(''),
			true)
			.addField('BPM', first.bpm, true)
			.addField('Set ID', first.setId, true)

			.addBlankField(true)
			.addField('Diffs', '\u200b', true)
			.addBlankField(true);

		beatmaps.sort((a: Beatmap, b: Beatmap) => b.difficultyRating - a.difficultyRating);

		for (const diff of beatmaps) {
			embed.addField(
				`${diff.version} -- ${diff.difficultyRating.toFixed(2)}\\⭐`,
				[
					`Mode: ${diff.mode}`,
					`**CS:** ${diff.circleSize.toFixed(1)} **HP:** ${diff.healthDrain.toFixed(1)}`,
					`**OD:** ${diff.overallDifficulty.toFixed(1)} **AR:** ${diff.approachRate.toFixed(1)}`,
				],
				true);

			if (embed.fields.length >= 25) break;
		}

		const remainder: number = (embed.fields.length + 2) % 3;
		if (remainder !== 0) {
			embed.addBlankField(true);
			if (remainder === 1) embed.addBlankField(true);
		}

		return message.channel.send(embed);
	}
}

export { OsuBeatmapCommand as Command };