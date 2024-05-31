import { InputConfiguration } from '@/components/input-list';

export const inputConfiguration: Array<InputConfiguration> = [
  { label: 'Company Name', name: 'companyName', validation: { required: 'Company name required' }, type: 'text' },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    validation: { required: 'Email required' }
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text',
    validation: { required: 'Address required' }
  },
  {
    name: 'phoneNumber',
    label: 'Phone Number',
    type: 'text',
    validation: { required: 'Phone number required' }
  },
  {
    name: 'fax',
    label: 'Fax Number',
    type: 'text',
    validation: { required: 'Fax number required' }
  },
  {
    name: 'firstTextField',
    label: 'First Text Field',
    type: 'text'
  },
  {
    name: 'secondTextField',
    label: 'Second Text Field',
    type: 'text'
  },
  {
    name: 'bannerUrl',
    label: 'Banner',
    type: 'pickImage',
    pickImageConfiguration: { fileLimit: 1 }
  },
  {
    name: 'logoUrl',
    label: 'Logo',
    type: 'pickImage',
    pickImageConfiguration: { fileLimit: 1 }
  },
  {
    name: 'topProductsUrl',
    label: 'Top Products Image',
    type: 'pickImage',
    pickImageConfiguration: { fileLimit: 1 }
  },
  {
    name: 'discountsUrl',
    label: 'Discounts Image',
    type: 'pickImage',
    pickImageConfiguration: { fileLimit: 1 }
  }
];
