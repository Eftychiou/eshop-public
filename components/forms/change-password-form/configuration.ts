import { InputConfiguration } from '@/components/input-list';

export const inputConfiguration: InputConfiguration[] = [
  {
    label: 'New Password',
    name: 'newPassword',
    type: 'password',
    validation: { required: 'New Password Required' }
  },
  {
    label: 'Old Password',
    name: 'oldPassword',
    type: 'password',
    validation: { required: 'Old Pasword Required' }
  }
];
