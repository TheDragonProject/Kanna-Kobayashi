import { AkitaNeru, Client, MessageCommand } from 'akita_neru';
import { Message } from 'discord.js';

class PingCommand extends MessageCommand
{
  protected client: Client;

  protected framework: AkitaNeru;

  constructor (akita: AkitaNeru)
  {
    super(akita, __filename, {
      name: 'ping',
      description: 'See how long I need to see your message and send a response',
    });

    this.framework = akita;
    this.client = akita.client;
  }

  public async callback (message: Message): Promise<void>
  {
    const sent = await message.channel.send('Searching for insects... <:kannaDetective:460201630026170368>');

    await sent.edit([
      `It took me **${sent.createdTimestamp - message.createdTimestamp}ms** to find and eat all insects!`,
      ` ~~**\`(WS: ${Math.floor(this.client.ws.ping)}ms)\`**~~ <:kannaHungry:458776120092000258>`,
    ].join('\n'));

    return;
  }
}

export { PingCommand as MessageCommand };
