export class UserDto {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: Date;
  last_login: Date;
  status: 'online' | 'offline';
}