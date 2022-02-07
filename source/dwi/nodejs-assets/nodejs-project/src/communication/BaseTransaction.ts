import { jsonProperty, Serializable } from "ts-serializable";
import 'reflect-metadata';
export class BaseTransaction extends Serializable {
  @jsonProperty(String)
  public Mnemonic: string = '';
  @jsonProperty(String)
  public Address: string = '';
  @jsonProperty(String)
  public Balance: string = '';
}
