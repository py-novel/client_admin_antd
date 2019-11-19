import { message } from 'antd'

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      message.error(err.message);
    },
  },
};
