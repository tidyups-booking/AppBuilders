import React, { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import colors from '@/constants/colors';
import {
  EXTRAS,
  FREQUENCIES,
  SERVICE_TYPES,
  estimatePrice,
} from '@/lib/booking-utils';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  getGetBookingStatsQueryKey,
  getGetUpcomingBookingsQueryKey,
  getListBookingsQueryKey,
  useCreateBooking,
} from '@workspace/api-client-react';
import type { BookingInput } from '@workspace/api-client-react';

const c = colors.light;

function Label({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

function Chip({
  label,
  active,
  onPress,
  testID,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function Stepper({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <View style={styles.stepper}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        style={styles.stepperBtn}
      >
        <Feather name="minus" size={18} color={c.primary} />
      </Pressable>
      <Text style={styles.stepperValue}>{value}</Text>
      <Pressable
        onPress={() => onChange(Math.min(max, value + 1))}
        style={styles.stepperBtn}
      >
        <Feather name="plus" size={18} color={c.primary} />
      </Pressable>
    </View>
  );
}

export default function NewBookingScreen() {
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Edmonton');
  const [postalCode, setPostalCode] = useState('');
  const [serviceType, setServiceType] =
    useState<BookingInput['serviceType']>('standard_clean');
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [extras, setExtras] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [frequency, setFrequency] =
    useState<BookingInput['frequency']>('one_time');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const price = useMemo(
    () => estimatePrice(serviceType, bedrooms, bathrooms, extras.length),
    [serviceType, bedrooms, bathrooms, extras.length],
  );

  const create = useCreateBooking({
    mutation: {
      onSuccess: (booking) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
        queryClient.invalidateQueries({
          queryKey: getGetBookingStatsQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetUpcomingBookingsQueryKey(),
        });
        resetForm();
        router.push(`/booking/${booking.id}`);
      },
      onError: () => {
        setError('Could not save the booking. Please try again.');
      },
    },
  });

  function resetForm() {
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setCity('Edmonton');
    setPostalCode('');
    setServiceType('standard_clean');
    setBedrooms(2);
    setBathrooms(1);
    setExtras([]);
    setScheduledDate('');
    setScheduledTime('');
    setFrequency('one_time');
    setNotes('');
    setError(null);
  }

  function toggleExtra(extra: string) {
    setExtras((prev) =>
      prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra],
    );
  }

  function submit() {
    setError(null);
    if (!firstName.trim() || !lastName.trim()) {
      setError('Customer first and last name are required.');
      return;
    }
    if (phone.trim().length < 7) {
      setError('A valid phone number is required.');
      return;
    }
    if (!address.trim() || !city.trim()) {
      setError('Address and city are required.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(scheduledDate.trim())) {
      setError('Date must be in YYYY-MM-DD format.');
      return;
    }
    if (!/^\d{1,2}:\d{2}$/.test(scheduledTime.trim())) {
      setError('Time must be in HH:MM format (24h).');
      return;
    }
    const input: BookingInput = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      province: 'AB',
      serviceType,
      bedrooms,
      bathrooms,
      extras,
      scheduledDate: scheduledDate.trim(),
      scheduledTime: scheduledTime.trim(),
      frequency,
      estimatedPrice: price,
    };
    if (email.trim()) input.email = email.trim();
    if (postalCode.trim()) input.postalCode = postalCode.trim();
    if (notes.trim()) input.notes = notes.trim();
    create.mutate({ data: input });
  }

  return (
    <KeyboardAwareScrollViewCompat
      style={styles.screen}
      bottomOffset={40}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingTop: topInset + 16,
        paddingBottom: 140,
        paddingHorizontal: 16,
        gap: 14,
      }}
    >
      <Text style={styles.title}>New Booking</Text>

      <Label>Service type</Label>
      <View style={styles.chipWrap}>
        {SERVICE_TYPES.map((s) => (
          <Chip
            key={s.value}
            testID={`service-${s.value}`}
            label={s.label}
            active={serviceType === s.value}
            onPress={() => setServiceType(s.value)}
          />
        ))}
      </View>

      <Label>Customer</Label>
      <View style={styles.row}>
        <TextInput
          testID="input-first-name"
          style={[styles.input, { flex: 1 }]}
          placeholder="First name"
          placeholderTextColor={c.mutedForeground}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          testID="input-last-name"
          style={[styles.input, { flex: 1 }]}
          placeholder="Last name"
          placeholderTextColor={c.mutedForeground}
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
      <TextInput
        testID="input-phone"
        style={styles.input}
        placeholder="Phone"
        placeholderTextColor={c.mutedForeground}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        testID="input-email"
        style={styles.input}
        placeholder="Email (optional)"
        placeholderTextColor={c.mutedForeground}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Label>Address</Label>
      <TextInput
        testID="input-address"
        style={styles.input}
        placeholder="Street address"
        placeholderTextColor={c.mutedForeground}
        value={address}
        onChangeText={setAddress}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1.4 }]}
          placeholder="City"
          placeholderTextColor={c.mutedForeground}
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Postal code"
          placeholderTextColor={c.mutedForeground}
          autoCapitalize="characters"
          value={postalCode}
          onChangeText={setPostalCode}
        />
      </View>

      <Label>Home size</Label>
      <View style={styles.row}>
        <View style={styles.sizeBlock}>
          <Text style={styles.sizeLabel}>Bedrooms</Text>
          <Stepper value={bedrooms} onChange={setBedrooms} min={0} max={10} />
        </View>
        <View style={styles.sizeBlock}>
          <Text style={styles.sizeLabel}>Bathrooms</Text>
          <Stepper value={bathrooms} onChange={setBathrooms} min={1} max={10} />
        </View>
      </View>

      <Label>Extras</Label>
      <View style={styles.chipWrap}>
        {EXTRAS.map((e) => (
          <Chip
            key={e}
            label={e}
            active={extras.includes(e)}
            onPress={() => toggleExtra(e)}
          />
        ))}
      </View>

      <Label>Schedule</Label>
      <View style={styles.row}>
        <TextInput
          testID="input-date"
          style={[styles.input, { flex: 1 }]}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={c.mutedForeground}
          value={scheduledDate}
          onChangeText={setScheduledDate}
        />
        <TextInput
          testID="input-time"
          style={[styles.input, { flex: 1 }]}
          placeholder="HH:MM"
          placeholderTextColor={c.mutedForeground}
          value={scheduledTime}
          onChangeText={setScheduledTime}
        />
      </View>
      <View style={styles.chipWrap}>
        {FREQUENCIES.map((f) => (
          <Chip
            key={f.value}
            label={f.label}
            active={frequency === f.value}
            onPress={() => setFrequency(f.value)}
          />
        ))}
      </View>

      <Label>Notes</Label>
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Gate code, pets, parking..."
        placeholderTextColor={c.mutedForeground}
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Estimated price</Text>
        <Text style={styles.priceValue}>${price}</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable
        testID="button-submit"
        onPress={submit}
        disabled={create.isPending}
        style={({ pressed }) => [
          styles.submitBtn,
          (pressed || create.isPending) && { opacity: 0.7 },
        ]}
      >
        <Feather name="check" size={18} color={c.primaryForeground} />
        <Text style={styles.submitText}>
          {create.isPending ? 'Saving...' : 'Book It'}
        </Text>
      </Pressable>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.background },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: c.foreground,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: c.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 4,
  },
  row: { flexDirection: 'row', gap: 10 },
  input: {
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.input,
    borderRadius: colors.radius,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: c.foreground,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: c.secondary,
    borderWidth: 1,
    borderColor: c.border,
  },
  chipActive: {
    backgroundColor: c.primary,
    borderColor: c.primary,
  },
  chipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: c.secondaryForeground,
  },
  chipTextActive: { color: c.primaryForeground },
  sizeBlock: {
    flex: 1,
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: colors.radius,
    padding: 12,
    gap: 8,
    alignItems: 'center',
  },
  sizeLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: c.mutedForeground,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepperBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: c.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: c.foreground,
    minWidth: 24,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: c.secondary,
    borderRadius: colors.radius,
    padding: 14,
  },
  priceLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: c.secondaryForeground,
  },
  priceValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: c.primary,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: c.destructive,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: c.primary,
    borderRadius: colors.radius,
    paddingVertical: 15,
  },
  submitText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: c.primaryForeground,
  },
});
