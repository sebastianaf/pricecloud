import sequelize from "../db/sequelize";
import boom from "@hapi/boom";
import errorCodes from "../config/errorCodes";

const { models } = sequelize;

class CCSPService {
  constructor() {}

  async evaluate(data) {
    const { nameCCSP_1, nameCCSP_2, service } = data;
    const ccsp1 = await models.CCSP.findOne({ where: { name: nameCCSP_1 } });
    const ccsp2 = await models.CCSP.findOne({ where: { name: nameCCSP_2 } });

    if (ccsp1 && ccsp2) {
      const score1 = () => {
        return 0;
      };
      const score2 = () => {
        return 0;
      };
      return {
        service,
        data: {
          nameCCSP_1: { score1 },
          nameCCSP_2: { score2 },
        },
      };
    } else {
      return boom.badRequest("", errorCodes.INTERNAL_ERROR_SERVER);
    }
  }
}

export default CCSPService;
