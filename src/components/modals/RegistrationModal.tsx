
import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { CheckCircle2, Calendar, MapPin, Send } from 'lucide-react';
import { ApiService } from '../../services/api';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventItem?: {
    id: string;
    title: string;
    date: string;
    location: string;
    eligibility?: string;
  } | null;
}

type FormFields = 'name' | 'email' | 'phone' | 'organization' | 'notes';

type FormErrors = Partial<Record<FormFields, string>>;

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  eventItem
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FormFields, boolean>>>({});

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const [errorMsg, setErrorMsg] = useState('');

  if (!eventItem) return null;

  // Validate individual fields
  const validateField = (field: FormFields, value: string): string => {
    const trimmedValue = value.trim();

    switch (field) {
      case 'name': {
        if (!trimmedValue) {
          return 'Full name is required.';
        }

        // At least two name parts; supports Unicode letters.
        const nameParts = trimmedValue.split(/\s+/);

        if (nameParts.length < 2) {
          return 'Please enter your first and last name.';
        }

        if (!/^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(trimmedValue)) {
          return 'Name can contain only letters, spaces, hyphens and apostrophes.';
        }

        return '';
      }

      case 'email': {
        if (!trimmedValue) {
          return 'Email address is required.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailRegex.test(trimmedValue)) {
          return 'Please enter a valid email address.';
        }

        return '';
      }

      case 'phone': {
        if (!trimmedValue) {
          return 'Phone / WhatsApp number is required.';
        }

        // Accept +, spaces, brackets and hyphens.
        if (!/^\+?[0-9\s()-]+$/.test(trimmedValue)) {
          return 'Please enter a valid phone number.';
        }

        const digits = trimmedValue.replace(/\D/g, '');

        if (digits.length < 10 || digits.length > 15) {
          return 'Phone number must contain 10–15 digits, including country code if provided.';
        }

        return '';
      }

      case 'organization': {
        if (!trimmedValue) {
          return 'College / Organization / Village is required.';
        }

        if (trimmedValue.length < 2) {
          return 'Please enter at least 2 characters.';
        }

        return '';
      }

      case 'notes': {
        if (!trimmedValue) {
          return 'Please tell us why you wish to participate.';
        }

        if (trimmedValue.length < 10) {
          return 'Please enter at least 10 characters.';
        }

        if (trimmedValue.length > 500) {
          return 'Please keep your message within 500 characters.';
        }

        return '';
      }

      default:
        return '';
    }
  };

  // Validate a field and update its inline error
  const handleFieldBlur = (field: FormFields, value: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    const error = validateField(field, value);

    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // Update a field and clear/update its error after it has been touched
  const handleFieldChange = (
    field: FormFields,
    value: string,
    setter: (value: string) => void
  ) => {
    setter(value);
    setErrorMsg('');

    if (touched[field]) {
      const error = validateField(field, value);

      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  const validateForm = (): boolean => {
    const values: Record<FormFields, string> = {
      name,
      email,
      phone,
      organization,
      notes
    };

    const newErrors: FormErrors = {};

    (Object.keys(values) as FormFields[]).forEach(field => {
      const error = validateField(field, values[field]);

      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    setTouched({
      name: true,
      email: true,
      phone: true,
      organization: true,
      notes: true
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateForm()) {
      return;
    }

    setStatus('loading');

    try {
      await ApiService.submitEventRegistration({
        eventId: eventItem.id,
        eventTitle: eventItem.title,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        organization: organization.trim(),
        notes: notes.trim()
      });

      setStatus('success');

      // Refresh event availability on the HomePage, if it listens for this event.
      window.dispatchEvent(new Event('event-registration-success'));

    } catch {
      setStatus('error');
      setErrorMsg(
        'Registration failed. Please try again or contact our team.'
      );
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setName('');
    setEmail('');
    setPhone('');
    setOrganization('');
    setNotes('');
    setErrors({});
    setTouched({});
    setErrorMsg('');
    onClose();
  };

  // Reusable inline error display
  const FieldError = ({ field }: { field: FormFields }) => {
    if (!errors[field]) return null;

    return (
      <p
        className="mt-1.5 text-[11px] text-rose-600"
        role="alert"
      >
        {errors[field]}
      </p>
    );
  };

  // Reusable input styling
  const inputClass = (field: FormFields) =>
    `w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl
    focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]
    transition-colors ${
      errors[field] && touched[field]
        ? 'border-rose-400 focus:ring-rose-200'
        : 'border-[#E5DFC5]'
    }`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={
        status === 'success'
          ? 'Registration Confirmed!'
          : 'Register for Program / Event'
      }
      subtitle={eventItem.title}
      maxWidth="xl"
    >
      {status === 'success' ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h4 className="text-xl font-bold font-serif-heading text-[#143D2B]">
            You're Registered!
          </h4>

          <p className="text-xs sm:text-sm text-[#5C6760] max-w-md mx-auto">
            A confirmation pass with schedule details, reporting venue, and
            preparatory materials has been dispatched to{' '}
            <span className="font-semibold text-[#1F2421]">
              {email}
            </span>.
          </p>

          <div className="pt-4">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-[#143D2B] text-white font-bold text-xs rounded-xl hover:bg-[#1E533B] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>

          {/* Event Context */}
          <div className="p-3 bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl text-xs space-y-1 text-[#5C6760]">
            <div className="flex items-center gap-1.5 text-[#143D2B] font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{eventItem.date}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>{eventItem.location}</span>
            </div>

            {eventItem.eligibility && (
              <p className="text-[11px] text-[#87986A] pt-1">
                Eligibility: {eventItem.eligibility}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">
            Full Name <span className="text-rose-600">*</span>
          </label>

            <input
              type="text"
              value={name}
              onChange={e =>
                handleFieldChange('name', e.target.value, setName)
              }
              onBlur={() => handleFieldBlur('name', name)}
              placeholder="e.g. Rahul Patil"
              className={inputClass('name')}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />

            <FieldError field="name" />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">
                Email <span className="text-rose-600">*</span>
              </label>

              <input
                type="email"
                value={email}
                onChange={e =>
                  handleFieldChange('email', e.target.value, setEmail)
                }
                onBlur={() => handleFieldBlur('email', email)}
                placeholder="rahul@example.com"
                className={inputClass('email')}
                aria-invalid={!!errors.email}
              />

              <FieldError field="email" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">
                Phone / WhatsApp <span className="text-rose-600">*</span>
              </label>

              <input
                type="tel"
                value={phone}
                onChange={e =>
                  handleFieldChange('phone', e.target.value, setPhone)
                }
                onBlur={() => handleFieldBlur('phone', phone)}
                placeholder="+91-9876543210"
                className={inputClass('phone')}
                aria-invalid={!!errors.phone}
              />

              <FieldError field="phone" />
            </div>
          </div>

          {/* Organization */}
          <div>
            <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">
              College / Organization / Village <span className="text-rose-600">*</span>
            </label>

            <input
              type="text"
              value={organization}
              onChange={e =>
                handleFieldChange(
                  'organization',
                  e.target.value,
                  setOrganization
                )
              }
              onBlur={() =>
                handleFieldBlur('organization', organization)
              }
              placeholder="e.g. Pune University / Gram Panchayat Bhamragad"
              className={inputClass('organization')}
              aria-invalid={!!errors.organization}
            />

            <FieldError field="organization" />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#1F2421] uppercase mb-1">
              Why do you wish to participate? <span className="text-rose-600">*</span>
            </label>

            <textarea
              rows={2}
              value={notes}
              onChange={e =>
                handleFieldChange('notes', e.target.value, setNotes)
              }
              onBlur={() => handleFieldBlur('notes', notes)}
              placeholder="Tell us briefly about your motivation (minimum 20 characters)..."
              maxLength={500}
              className={inputClass('notes')}
              aria-invalid={!!errors.notes}
            />

            <div className="flex justify-between items-center mt-1">
              <FieldError field="notes" />
              <span className="text-[10px] text-gray-400 ml-auto">
                {notes.length}/500
              </span>
            </div>
          </div>

          {/* API / Submission Error */}
          {errorMsg && (
            <p
              className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200"
              role="alert"
            >
              {errorMsg}
            </p>
          )}

          {/* Actions */}
          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex-1 py-3 px-4 bg-[#143D2B] hover:bg-[#1E533B] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />

              <span>
                {status === 'loading'
                  ? 'Submitting Registration...'
                  : 'Confirm Registration'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={status === 'loading'}
              className="py-3 px-4 border border-gray-300 rounded-xl text-xs text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
