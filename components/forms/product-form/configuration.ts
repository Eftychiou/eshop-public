import { InputConfiguration } from '@/components/input-list';

export const inputConfiguration: InputConfiguration[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    validation: {
      required: 'Title required',
      minLength: {
        message: 'Too short',
        value: 5
      }
    }
  },
  {
    name: 'brand',
    label: 'Brand',
    type: 'text',
    validation: {
      required: 'Brand required'
    }
  },
  {
    name: 'model',
    label: 'Model',
    type: 'text',
    validation: {
      required: 'Model required'
    }
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    validation: {
      required: 'Price required'
    }
  },
  {
    name: 'stock',
    label: 'Stock',
    type: 'number',
    validation: {
      required: 'Stock required'
    }
  },
  {
    name: 'topSale',
    label: 'Top Sale',
    type: 'dropdown'
  },
  {
    name: 'discount',
    label: 'Discount',
    type: 'number',
    validation: {
      required: 'Discount required'
    }
  },
  {
    name: 'categories',
    label: 'Categories',
    type: 'categories'
  },
  {
    name: 'shortDescription',
    label: 'Short Description',
    type: 'textarea',
    validation: {
      required: 'Short description required'
    }
  },
  {
    name: 'longDescription',
    label: 'Long Description',
    type: 'textarea',
    validation: {
      required: 'Long description required'
    }
  },
  {
    name: 'images',
    label: 'Images',
    type: 'pickImage',
    validation: { required: 'Images required' },
    pickImageConfiguration: { fileLimit: 3 }
  }
];
