import { ParameterizedContext, DefaultState, Context, Next } from 'koa'
import { Document } from 'mongoose';
export type KoaContextProp = ParameterizedContext<any, DefaultState, Context>;
export type KoaNextProp = Next;

// mongoose controllers type
type ControllersType = (ctx: KoaContextProp, next: KoaNextProp) => void;
export interface ControllersProp {
  add?: ControllersType;
  get?: ControllersType;
  update?: ControllersType;
  remove?: ControllersType;
  verification?: ControllersType;
  login?: ControllersType;
}

// config配置文件 类型 位于 config
interface ConfigDBProp {
  user: string;
  pwd: string;
  host: string;
  port: number;
  dataBase: string
  key: string;
  iv: string;
}

interface ConfigDebugProp {
  isProd: boolean;
}

export interface ConfigProp {
  port: number;
  db: ConfigDBProp;
  debug: ConfigDebugProp;
  dataOut: number;
}

// send 扩展方法传参类型 位于 useCommon
export interface SendProp {
  message?: string;
  code?: number;
  token?: string;
  status?: boolean;
  result?: any;
}

// getSend message 类型 位于 useCommon
export interface MessageCodeProp {
  [code: number]: string;
}

// 共用类型
export interface ObjectAnyProp<P> {
  [key: string]: P;
}

// verification User
export type LoginType = 'user' | 'wechat' | 'mobile'
export interface RegionProps {
  code: number;
  name: string;
}
export interface UserSchemaProps extends Document {
  type: string;
  account?: string;
  wechat?: string;
  imageUrl?: string;
  mobilePhone?: string;
  password?: string;
  verificationCode?: number;
  nickName?: string;
  sex?: 0 | 1;
  region?: RegionProps[];
  birthday?: string;
  signature?: string;
  realNameAuthentication?: string;
  createTime?: Date;
  updateTime?: Date;
}

export interface UserJsonProps {
  _id: string;
  mobilePhone: string;
  password: string;
  time: number;
  timeOut: number;
}
