import { jsonProperty, Serializable } from "ts-serializable";
import 'reflect-metadata';
export class Account extends Serializable {
  @jsonProperty(String)
  public Mnemonic: string = '';
  @jsonProperty(String)
  public Identity: string = '';
  @jsonProperty(String)
  public AccountId: string = '';
}
