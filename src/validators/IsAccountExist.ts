import { registerDecorator, ValidationOptions, ValidatorConstraint } from "class-validator";
import { ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { AccountRepo } from "../services/accounts/repositories/AccountRepo";

@Service()
@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
  @InjectRepository(AccountRepo)
  private readonly repo: AccountRepo;
  async validate(email: string, args: ValidationArguments) {
    // const isExist = await this.repo.isAccountExist(email);
    // if (isExist) return false;
    return true;
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}
