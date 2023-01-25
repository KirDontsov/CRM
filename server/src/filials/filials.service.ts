import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';

import { CreateFilialInput } from './dto/create-filial.input';
// import { UpdateFilialInput } from './dto/update-filial.input';
import { FilialsRepository } from './mongo/filials.repository';
import { FetchFilialsByUserInput } from './dto/fetch-filials-by-user.input';
import { UpdateFilialInput } from './dto/update-filial.input';

@Injectable()
export class FilialsService {
  constructor(private readonly filialsRepository: FilialsRepository) {}

  findAll() {
    return this.filialsRepository.find({});
  }

  findAllByUserId(@Args() args: FetchFilialsByUserInput) {
    return this.filialsRepository.findAllByUserId(args);
  }

  create(createFilialInput: CreateFilialInput) {
    return this.filialsRepository.create(createFilialInput);
  }

  findOne(id: string) {
    return this.filialsRepository.find({ id });
  }

  // updateFilialInput: UpdateFilialInput
  update(id: number, input: UpdateFilialInput) {
    return `This action updates a #${id} ${input} filial`;
  }

  remove(id: number) {
    return `This action removes a #${id} filial`;
  }
}
