import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';

import { CreateFilialInput } from './dto/create-filial.input';
// import { UpdateFilialInput } from './dto/update-filial.input';
import { FilialsRepository } from './mongo/filials.repository';
import { UpdateFilialInput } from './dto/update-filial.input';
import { FetchFilialsByUserInput } from './dto/fetch-filials-by-user.input';

@Injectable()
export class FilialsService {
  constructor(private readonly filialsRepository: FilialsRepository) {}

  findAll() {
    return this.filialsRepository.find({});
  }

  findAllByContext(context) {
    return this.filialsRepository.findAllByContext(context);
  }

  findAllByUserId(@Args() args: FetchFilialsByUserInput) {
    return this.filialsRepository.findAllByUserId(args);
  }

  create(createFilialInput: CreateFilialInput) {
    return this.filialsRepository.create(createFilialInput);
  }

  findOne(id: string) {
    return this.filialsRepository.findOne({ id });
  }

  update(id: string, updateFilialInput: UpdateFilialInput) {
    return this.filialsRepository.findOneAndUpdate({ id }, updateFilialInput);
  }

  remove(id: number) {
    return `This action removes a #${id} filial`;
  }
}
