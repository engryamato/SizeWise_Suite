import Ajv from 'ajv';
import scheduleSchema from '../schemas/schedule.schema.json' assert { type: 'json' };

const ajv = new Ajv();
const validate = ajv.compile(scheduleSchema);

export function validateSchedule(data) {
  const valid = validate(data);
  if (!valid) {
    throw new Error(ajv.errorsText(validate.errors));
  }
  return true;
}
