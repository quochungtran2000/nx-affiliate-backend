import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { IMerchant } from '@shared/models/entities';
import { CreateMerchantDTO, GetMerchantResponse } from '@shared/models/dtos';
import { RpcException } from '@nestjs/microservices';
import { Model } from 'mongoose';

@Injectable()
export class MerchantRepository {
  private readonly logger = new Logger(`${MerchantRepository.name}`);

  constructor(@Inject('MERCHANT_MODEL') private MerchantModel: Model<IMerchant>) {}

  async getMerchants() {
    try {
      this.logger.log(`${this.getMerchants.name} called`);
      const response = await this.MerchantModel.find().exec();
      console.log({ response });
      return response;
    } catch (error) {
      this.logger.error(`${this.getMerchants.name} ${error.message}`);
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async createOrUpdateMany(data: GetMerchantResponse | GetMerchantResponse[]) {
    try {
      this.logger.log(`${this.createOrUpdateMany.name} called`);
      const tobeCreatedOrUpdate = Array.isArray(data) ? CreateMerchantDTO.froms(data) : [CreateMerchantDTO.from(data)];
      const tobeCreated: CreateMerchantDTO[] = [];
      const tobeUpdated: CreateMerchantDTO[] = [];
      const keys = tobeCreatedOrUpdate.map((elm) => elm.merchant_id);

      const exits = await (
        await this.MerchantModel.find({
          merchant_id: { $in: keys },
        }).exec()
      ).map((elm) => elm.merchant_id);

      console.log({ exits });

      tobeCreatedOrUpdate.forEach((element) => {
        if (exits.includes(element.merchant_id)) tobeUpdated.push(element);
        else tobeCreated.push(element);
      });

      if (tobeCreated.length) {
        this.logger.log(`${this.createOrUpdateMany.name} Insert ${JSON.stringify(tobeCreated)}`);
        await this.MerchantModel.insertMany(tobeCreated);
      }

      if (tobeUpdated.length) {
        this.logger.log(`${this.createOrUpdateMany.name} Update ${JSON.stringify(tobeUpdated)}`);
        // await this.MerchantModel.updateMany(
        //   { merchant_id: { $in: exits } },
        //   { $set: { total_offer:  true } },
        //   { multi: true }
        // );

        await this.MerchantModel.bulkWrite(
          tobeUpdated.map((elm) => {
            return {
              updateOne: {
                filter: {
                  merchant_id: elm.merchant_id,
                },
                update: {
                  total_offer: elm.total_offer,
                },
              },
            };
          })
        );
      }

      return { success: true, message: 'Sync Merchant Successfully' };
    } catch (error) {
      this.logger.error(`${this.createOrUpdateMany.name} ${error.message}`);
      throw new RpcException(new InternalServerErrorException());
    }
  }
}
