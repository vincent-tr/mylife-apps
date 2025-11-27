export type NagiosHostStatus = 'pending' | 'up' | 'down' | 'unreachable';

export type NagiosServiceStatus = 'pending' | 'ok' | 'warning' | 'unknown' | 'critical';

export type NagiosObjectType = 'host' | 'service';

export type UpdatesStatus = 'uptodate' | 'outdated' | 'unknown';

// UPS status flags as defined in APC UPS Status Byte
export enum UpsmonStatusFlag {
  Calibration = 0x00000001,
  Trim = 0x00000002,
  Boost = 0x00000004,
  Online = 0x00000008,
  Onbatt = 0x00000010,
  Overload = 0x00000020,
  Battlow = 0x00000040,
  Replacebatt = 0x00000080,
  Commlost = 0x00000100,
  Shutdown = 0x00000200,
  Slave = 0x00000400,
  Slavedown = 0x00000800,
  OnbattMsg = 0x00020000,
  Fastpoll = 0x00040000,
  ShutLoad = 0x00080000,
  ShutBtime = 0x00100000,
  ShutLtime = 0x00200000,
  ShutEmerg = 0x00400000,
  ShutRemote = 0x00800000,
  Plugged = 0x01000000,
  Battpresent = 0x04000000,
}
