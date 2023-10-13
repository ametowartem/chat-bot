import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessageEntity } from '../../message/entity/message.entity';

@Entity('chats')
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'chat_name' })
  chatName: string;

  @OneToMany(() => MessageEntity, (message) => message.chat)
  messages?: MessageEntity[];

  constructor(chatName: string, messages?: MessageEntity[], uuid?: string) {
    this.uuid = uuid;
    this.chatName = chatName;
    this.messages = messages;
  }
}
