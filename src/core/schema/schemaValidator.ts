// src/core/schema/schemaValidator.ts
import Ajv from 'ajv';
import toolSchema from './toolSchema.json';
import ruleSchema from './ruleSchema.json';

export class SchemaValidator {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv();
    this.ajv.addSchema(toolSchema, 'tool');
    this.ajv.addSchema(ruleSchema, 'rule');
  }

  validateToolConfig(config: unknown): boolean {
    return this.ajv.validate('tool', config) as boolean;
  }

  validateRuleConfig(rule: unknown): boolean {
    return this.ajv.validate('rule', rule) as boolean;
  }

  getValidationErrors(): string[] | null {
    return this.ajv.errors ? this.ajv.errors.map(e => `${e.instancePath} ${e.message}`) : null;
  }
}
