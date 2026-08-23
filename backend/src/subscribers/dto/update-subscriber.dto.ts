import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriberDto } from 'src/subscribers/dto/create-subscriber.dto';

export class UpdateSubscriberDto extends PartialType(CreateSubscriberDto) {}
