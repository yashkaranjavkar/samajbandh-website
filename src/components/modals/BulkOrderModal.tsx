
import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { CheckCircle2, Building, Send } from 'lucide-react';
import { ApiService } from '../../services/api';

interface BulkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultItem?: string;
}

type FieldName =
  | 'orgName'
  | 'contactPerson'
  | 'designation'
  | 'email'
  | 'phone'
  | 'itemType'
  | 'otherItem'
  | 'quantity'
  | 'notes';

type FormErrors = Partial<Record<FieldName, string>>;

const PRODUCT_OPTIONS = [
  'Asha Reusable Cloth Pads (Pack of 4)',
  'Samata School Menstrual Health Kit',
  'Emergency Relief Menstrual Kit',
  'Custom Workshop + Pad Distribution Drive',
  'ToT Training for Field Staff',
];

const validateField = (
  field: FieldName,
  value: string
): string => {
  switch (field) {
    case 'orgName':
      return value.trim().length >= 2
        ? ''
        : 'Please enter the organization or school name.';

    case 'contactPerson':
      return /^[A-Za-z][A-Za-z'.-]*(?:\s+[A-Za-z][A-Za-z'.-]*)+$/.test(
        value.trim()
      )
        ? ''
        : 'Enter your first name and surname, separated by a space.';

    case 'designation':
      return value.trim()
        ? ''
        : 'Please enter your designation or role.';

    case 'email':
      return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value.trim())
        ? ''
        : 'Enter a valid email address, e.g. name@company.com.';

    case 'phone':
      return /^\d{10}$/.test(value)
        ? ''
        : 'Enter exactly 10 digits after +91.';

    case 'itemType':
      return value
        ? ''
        : 'Please select a product or kit.';

    case 'otherItem':
      return value.trim()
        ? ''
        : 'Please specify the product or service.';

    case 'quantity': {
      const quantity = Number(value);

      return Number.isInteger(quantity) &&
        quantity >= 25 &&
        quantity % 25 === 0
        ? ''
        : 'Quantity must be at least 25 and in multiples of 25.';
    }

    case 'notes':
      return value.trim()
        ? ''
        : 'Please enter the delivery location and requirements.';

    default:
      return '';
  }
};

export const BulkOrderModal: React.FC<BulkOrderModalProps> = ({
  isOpen,
  onClose,
  defaultItem = 'Asha Reusable Cloth Pads',
}) => {
  const [orgName, setOrgName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [itemType, setItemType] = useState(
    PRODUCT_OPTIONS.includes(defaultItem) ? defaultItem : ''
  );
  const [otherItem, setOtherItem] = useState('');
  const [quantity, setQuantity] = useState('100');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const updateFieldError = (
    field: FieldName,
    value: string
  ) => {
    setErrors((previous) => ({
      ...previous,
      [field]: validateField(field, value),
    }));
  };

  const inputClass = (field: FieldName) =>
    `w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B] ${
      errors[field]
        ? 'border-red-500'
        : 'border-[#E5DFC5]'
    }`;

  const ErrorMessage = ({ field }: { field: FieldName }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-600" role="alert">
        {errors[field]}
      </p>
    ) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const values: Record<FieldName, string> = {
      orgName,
      contactPerson,
      designation,
      email,
      phone,
      itemType,
      otherItem: itemType === 'Other' ? otherItem : 'not-required',
      quantity,
      notes,
    };

    const nextErrors: FormErrors = {};

    (Object.keys(values) as FieldName[]).forEach((field) => {
      if (field === 'otherItem' && itemType !== 'Other') {
        return;
      }

      const error = validateField(field, values[field]);

      if (error) {
        nextErrors[field] = error;
      }
    });

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle');
      return;
    }

    setStatus('loading');

    try {
      await ApiService.submitBulkOrder({
        organizationName: orgName.trim(),
        contactPerson: contactPerson.trim(),
        designation: designation.trim(),
        email: email.trim(),
        phone: `+91${phone}`,
        itemType:
          itemType === 'Other'
            ? otherItem.trim()
            : itemType,
        otherItem:
          itemType === 'Other'
            ? otherItem.trim()
            : '',
        quantity: Number(quantity),
        notes: notes.trim(),
      });

      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setOrgName('');
    setContactPerson('');
    setDesignation('');
    setEmail('');
    setPhone('');
    setItemType(
      PRODUCT_OPTIONS.includes(defaultItem) ? defaultItem : ''
    );
    setOtherItem('');
    setQuantity('100');
    setNotes('');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={
        status === 'success'
          ? 'Inquiry Received!'
          : 'Institutional & CSR Bulk Procurement'
      }
      subtitle="Equip schools, factories, or rural community clusters with subsidized sanitary kits."
      maxWidth="xl"
    >
      {status === 'success' ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h4 className="text-xl font-bold font-serif-heading text-[#143D2B]">
            Thank You for Partnering!
          </h4>

          <p className="text-xs sm:text-sm text-[#5C6760] max-w-md mx-auto">
            Our institutional partnerships desk will email a
            customized quotation and delivery timelines to{' '}
            <span className="font-semibold text-[#1F2421]">
              {email}
            </span>{' '}
            within 24 hours.
          </p>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 bg-[#143D2B] text-white font-bold text-xs rounded-xl hover:bg-[#1E533B] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 text-left"
        >
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-[#143D2B] flex items-center gap-2">
            <Building className="w-4 h-4 text-[#143D2B] shrink-0" />
            <span>
              Special subsidized rates for Zilla Parishad schools,
              NGOs, and CSR village sponsorships.
            </span>
          </div>

          {/* Organization */}
          <div>
            <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">
              Organization / School / CSR Entity *
            </label>

            <input
              type="text"
              value={orgName}
              onChange={(e) => {
                setOrgName(e.target.value);
                if (errors.orgName) {
                  updateFieldError('orgName', e.target.value);
                }
              }}
              onBlur={() => updateFieldError('orgName', orgName)}
              placeholder="e.g. Tata Motors CSR / Saraswati Vidyalaya"
              className={inputClass('orgName')}
              required
            />
            <ErrorMessage field="orgName" />
          </div>

          {/* Contact person and designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">
                Contact Person Name *
              </label>

              <input
                type="text"
                value={contactPerson}
                onChange={(e) => {
                  setContactPerson(e.target.value);
                  if (errors.contactPerson) {
                    updateFieldError('contactPerson', e.target.value);
                  }
                }}
                onBlur={() =>
                  updateFieldError('contactPerson', contactPerson)
                }
                placeholder="e.g. Anita Shinde"
                className={inputClass('contactPerson')}
                required
              />
              <ErrorMessage field="contactPerson" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">
                Designation / Role *
              </label>

              <input
                type="text"
                value={designation}
                onChange={(e) => {
                  setDesignation(e.target.value);
                  if (errors.designation) {
                    updateFieldError('designation', e.target.value);
                  }
                }}
                onBlur={() =>
                  updateFieldError('designation', designation)
                }
                placeholder="e.g. CSR Lead / Principal"
                className={inputClass('designation')}
                required
              />
              <ErrorMessage field="designation" />
            </div>
          </div>

          {/* Email and phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">
                Official Email *
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    updateFieldError('email', e.target.value);
                  }
                }}
                onBlur={() => updateFieldError('email', email)}
                placeholder="anita@company.com"
                className={inputClass('email')}
                autoComplete="email"
                required
              />
              <ErrorMessage field="email" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">
                Phone Number *
              </label>

              <div
                className={`flex items-center rounded-xl border bg-white focus-within:ring-2 focus-within:ring-[#143D2B] ${
                  errors.phone
                    ? 'border-red-500'
                    : 'border-[#E5DFC5]'
                }`}
              >
                <span className="px-3 py-2.5 text-sm text-slate-700 border-r border-[#E5DFC5]">
                  +91
                </span>

                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 10);

                    setPhone(value);

                    if (errors.phone) {
                      updateFieldError('phone', value);
                    }
                  }}
                  onBlur={() => updateFieldError('phone', phone)}
                  placeholder="9876543210"
                  className="w-full min-w-0 px-3 py-2.5 text-sm rounded-r-xl focus:outline-hidden"
                  required
                />
              </div>

              <ErrorMessage field="phone" />
            </div>
          </div>

          {/* Product and quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">
                Product / Kit Required *
              </label>

              <select
                value={itemType}
                onChange={(e) => {
                  const value = e.target.value;

                  setItemType(value);

                  if (value !== 'Other') {
                    setOtherItem('');
                    setErrors((previous) => ({
                      ...previous,
                      itemType: validateField('itemType', value),
                      otherItem: undefined,
                    }));
                  } else {
                    updateFieldError('itemType', value);
                  }
                }}
                className={inputClass('itemType')}
                required
              >
                <option value="">Select a product or kit</option>

                {PRODUCT_OPTIONS.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}

                <option value="Other">Other</option>
              </select>

              <ErrorMessage field="itemType" />

              {itemType === 'Other' && (
                <div className="mt-3">
                  <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">
                    Specify Product / Service *
                  </label>

                  <input
                    type="text"
                    value={otherItem}
                    onChange={(e) => {
                      setOtherItem(e.target.value);

                      if (errors.otherItem) {
                        updateFieldError('otherItem', e.target.value);
                      }
                    }}
                    onBlur={() =>
                      updateFieldError('otherItem', otherItem)
                    }
                    placeholder="Describe the product or service you need"
                    className={inputClass('otherItem')}
                    required
                  />

                  <ErrorMessage field="otherItem" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">
                Estimated Quantity (Units) *
              </label>

              <input
                type="number"
                min="25"
                step="25"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);

                  if (errors.quantity) {
                    updateFieldError('quantity', e.target.value);
                  }
                }}
                onBlur={() =>
                  updateFieldError('quantity', quantity)
                }
                className={inputClass('quantity')}
                required
              />

              <ErrorMessage field="quantity" />
            </div>
          </div>

          {/* Delivery requirements */}
          <div>
            <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">
              Target District / Delivery Requirements *
            </label>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);

                if (errors.notes) {
                  updateFieldError('notes', e.target.value);
                }
              }}
              onBlur={() => updateFieldError('notes', notes)}
              placeholder="Specify destination, district, delivery timeline, or workshop requirements..."
              className={inputClass('notes')}
              required
            />

            <ErrorMessage field="notes" />
          </div>

          {/* API error */}
          {status === 'error' && (
            <p className="text-sm text-red-600" role="alert">
              We couldn't submit your inquiry. Please check your
              connection and try again.
            </p>
          )}

          {/* Buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex-1 py-3 px-4 bg-[#C85A32] hover:bg-[#B84A28] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />

              <span>
                {status === 'loading'
                  ? 'Submitting Inquiry...'
                  : 'Submit Bulk Order Inquiry'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={status === 'loading'}
              className="py-3 px-4 border border-gray-300 rounded-xl text-xs text-gray-700 hover:bg-gray-100 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
