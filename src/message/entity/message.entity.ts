import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { ChatEntity } from '../../chat/entity/chat.entity';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  text: string;

  @Column({ name: 'time_sending' })
  timeSending: Date;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  @JoinColumn({ name: 'user_uuid' })
  user?: UserEntity;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages)
  @JoinColumn({ name: 'chat_uuid' })
  chat?: ChatEntity;

  constructor(
    text: string,
    user: UserEntity,
    chat: ChatEntity,
    timeSending?: Date,
    uuid?: string,
  ) {
    this.uuid = uuid;
    this.text = text;
    this.user = user;
    this.chat = chat;
    this.timeSending = timeSending || new Date();
  }
}
