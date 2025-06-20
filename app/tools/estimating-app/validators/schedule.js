import Ajv from 'ajv';

const scheduleSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Schedule",
  "type": "object",
  "properties": {
    "task": { "type": "string" },
    "hours": { "type": "number", "minimum": 0 }
  },
  "required": ["task", "hours"],
  "additionalProperties": false
};

const ajv = new Ajv();
const validate = ajv.compile(scheduleSchema);

export function validateSchedule(data) {
  const valid = validate(data);
  if (!valid) {
    throw new Error(ajv.errorsText(validate.errors));
  }
  return true;
}
