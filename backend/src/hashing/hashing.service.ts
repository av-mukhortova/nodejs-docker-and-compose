import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  async getHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async verifyHash(hash: string, password: string) {
    const res = bcrypt.compare(password, hash);
    return res;
  }
}
