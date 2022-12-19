import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { GetWebhookQueryDTO } from '@shared/models/dtos';
import { MESSENGER_POSTBACK } from '@shared/utils';
import { config } from './config/configuration';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
  private readonly logger = new Logger(`Micro-Messenger.${AppService.name}`);
  // eslint-disable-next-line no-useless-escape
  private readonly urlRegex = /(https:\/\/shopee.vn|https:\/\/tiki.vn).[a-zA-Z0-9%\/\.\-\?\=\_\&\+]{2,}/g;

  constructor(private readonly httpService: HttpService) {}

  getData(): { message: string } {
    return { message: 'Welcome to messenger service!' };
  }

  getWebhook(data: GetWebhookQueryDTO) {
    try {
      this.logger.log(`${this.getWebhook.name} called with ${JSON.stringify(data)}`);
      let response = {
        code: 403,
        message: null,
      };

      const mode = data['hub.mode'];
      const token = data['hub.verify_token'];
      const challenge = data['hub.challenge'];

      // Checks if a token and mode is in the query string of the request
      if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === config.messenger.verifyToken) {
          // Responds with the challenge token from the request
          this.logger.log(`${this.getWebhook.name} -> WEBHOOK_VERIFIED`);
          response = {
            code: 200,
            message: challenge,
          };
        }
      }
      return response;
    } catch (error) {
      this.logger.error(`${this.getWebhook.name} ${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    }
  }

  postWebhook(data: any) {
    try {
      this.logger.log(`${this.postWebhook.name} Data:${JSON.stringify(data)}`);
      let response = { code: 404, message: null };

      if (data.object === 'page') {
        data.entry.forEach(async (entry) => {
          // Get the webhook event. entry.messaging is an array, but
          // will only ever contain one event, so we get index 0
          const webhook_event = entry.messaging[0];
          this.logger.log(`${this.postWebhook.name} Webhook Event: ${JSON.stringify(webhook_event)}`);

          const sender_psid = webhook_event.sender.id;
          this.logger.log(`${this.postWebhook.name} Sender PSID: :${sender_psid}`);

          if (webhook_event.message) {
            // if (webhook_event.message.tags && webhook_event.message.tags.source === 'customer_chat_plugin')
            //   await this.handleMessage(sender_psid, webhook_event.message);
            // else
            await this.handleMessage(sender_psid, webhook_event.message);
          } else if (webhook_event.postback) {
            await this.handlePostback(sender_psid, webhook_event.postback);
          }
        });

        // Returns a '200 OK' response to all requests
        response = { code: 200, message: 'EVENT_RECEIVED' };
        // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.
      }
      return response;
    } catch (error) {
      this.logger.error(`${this.getWebhook.name} ${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    }
  }

  async handleMessage(sender_psid, received_message) {
    try {
      let response = null;
      console.log(received_message);

      // const fallbackMessageFromFanpage =
      //   received_message.attachments &&
      //   received_message.attachments[0] &&
      //   received_message.attachments[0].type === 'fallback';

      // const messageFromWebsite =
      //   received_message.tags &&
      //   received_message.tags.source === 'customer_chat_plugin';

      // // Checks if the message contains text
      // if (received_message.text) {
      //   if (fallbackMessageFromFanpage || messageFromWebsite) {
      //     const urls = received_message.text.match(this.urlRegex);
      //     if (urls && urls.length) {
      //       const data = await this.httpService
      //         .get(
      //           `https://api.accesstrade.vn/v1/offers_informations/coupon?url=${urls[0]}&limit=10`,
      //           {
      //             headers: {
      //               authorization: `Token ${config.accessTrader.accessKey}`,
      //             },
      //           },
      //         )
      //         .toPromise();
      //       if (data && data.data.status) {
      //         console.log(data.data?.data.length);

      //         const coupons = data.data?.data || [];
      //         console.log(coupons);
      //         if (coupons.length)
      //           response = {
      //             text: `Có ${coupons.length} mã giảm giá có thể áp dụng. Xem thêm tại đây: https://hunghamhoc.com`,
      //           };
      //       }
      //     } else {
      //       response = {
      //         text: `Hiện tại chỉ hỗ trợ tìm kiếm coupon qua link của shopee và tiki!`,
      //       };
      //     }
      //   }
      // }

      // response = {
      //   text: received_message.text
      // };

      response = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Welcome!',
                image_url: 'https://img.anime47.com/imgur/U2e45Zq.gif',
                subtitle: 'We have the right hat for everyone.',
                default_action: {
                  type: 'web_url',
                  url: 'https://www.originalcoastclothing.com/',
                  webview_height_ratio: 'full',
                },
                buttons: [
                  {
                    type: 'web_url',
                    url: 'https://www.originalcoastclothing.com/',
                    title: 'View Website',
                  },
                  {
                    type: 'postback',
                    title: 'Start Chatting',
                    payload: 'DEVELOPER_DEFINED_PAYLOAD',
                  },
                ],
              },
            ],
          },
        },
      };

      // Sends the response message
      if (response) await this.callSendAPI(sender_psid, response);
    } catch (error) {
      this.logger.error(`${this.handleMessage.name} : ${error.message}`);
    }
  }

  async handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    const payload = received_postback.payload;

    // Set the response based on the postback payload
    switch (payload) {
      case MESSENGER_POSTBACK.GET_STARTED: {
        response = await this.handleGettingStarted();
        break;
      }
      case MESSENGER_POSTBACK.SEARCH_BY_MERCHANT: {
        response = await this.handleIncommingFeature();
        break;
      }
      case MESSENGER_POSTBACK.SEARCH_BY_PRODUCT_LINK: {
        response = await this.handleIncommingFeature();
        break;
      }
      case MESSENGER_POSTBACK.SEARCH_HIGHLAND_COUPON: {
        response = await this.handleSearchHighlandCoupon();
        break;
      }
      case MESSENGER_POSTBACK.WEEKLY_HOT_COUPON: {
        response = await this.handleIncommingFeature();
        break;
      }
      case MESSENGER_POSTBACK.TUTOTIAL: {
        response = await this.handleIncommingFeature();
        break;
      }
      default: {
        this.logger.log(`${this.handlePostback.name} can't handler postback`);
      }
    }

    if (response) this.callSendAPI(sender_psid, response);
    // Send the message to acknowledge the postback
  }

  async callSendAPI(sender_psid, response): Promise<any> {
    try {
      const request_body = {
        recipient: {
          id: sender_psid,
        },
        message: response,
      };

      this.logger.log(`${this.callSendAPI.name} Payload: ${JSON.stringify(request_body)}`);
      // Send the HTTP request to the Messenger Platform
      const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${config.messenger.verifyToken}`;
      return await this.httpService.axiosRef.post(url, request_body);
    } catch (error) {
      this.logger.error(`${this.callSendAPI.name} : ${error.message}`);
    }
  }

  async handleIncommingFeature() {
    this.logger.log(`${this.handleIncommingFeature.name} called`);
    const message = {
      text: `Chức năng này đang được phát triển xin vui lòng thử lại sau!`,
    };
    return message;
  }

  async handleGettingStarted() {
    this.logger.log(`${this.handleGettingStarted.name} called`);
    // const message = await this.messengerRepo.getMessage(POSTBACK.GET_STARTED);
    const message = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: 'Vui lòng chọn chức năng',
          buttons: [
            {
              type: 'postback',
              title: 'Ưu đãi từ highland coffee',
              payload: MESSENGER_POSTBACK.SEARCH_HIGHLAND_COUPON,
            },
            {
              type: 'postback',
              title: 'Tra cứu theo nơi bán',
              payload: MESSENGER_POSTBACK.SEARCH_BY_MERCHANT,
            },
            {
              type: 'postback',
              title: 'Tra cứu theo liên kết sản phẩm',
              payload: MESSENGER_POSTBACK.SEARCH_BY_PRODUCT_LINK,
            },
            {
              type: 'web_url',
              title: 'Tham khảo thêm tại website',
              url: 'https://hunghamhoc.com/',
              webview_height_ratio: 'full',
            },
          ],
        },
      },
    };
    return message;
  }

  async handleSearchHighlandCoupon() {
    this.logger.log(`${this.handleSearchHighlandCoupon.name} called`);
    // const message = await this.messengerRepo.getMessage(
    //   POSTBACK.SEARCH_HIGHLAND_COUPON,
    // );

    const message = {
      data: {
        text: `Tìm kiếm mã giảm giá highland coffee`,
      },
    };
    return message.data || '';
  }
}
