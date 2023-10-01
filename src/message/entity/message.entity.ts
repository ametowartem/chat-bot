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

  @Column({ name: 'chat_uuid' })
  chatUuid: string;

  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column()
  text: string;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  @JoinColumn({ name: 'user_uuid' })
  user?: UserEntity;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages)
  @JoinColumn({ name: 'chat_uuid' })
  chat?: ChatEntity;

  constructor(
    chatUuid: string,
    userUuid: string,
    text: string,
    user: UserEntity,
    chat: ChatEntity,
    uuid?: string,
  ) {
    this.uuid = uuid;
    this.chatUuid = chatUuid;
    this.userUuid = userUuid;
    this.text = text;
    this.user = user;
    this.chat = chat;
  }
}
