# Form Validation Migration Guide

This guide explains how to migrate existing form validation logic to use the new reusable validation helper functions.

## Overview

The new validation system eliminates code duplication by providing:
- **Reusable validation logic** across all form components
- **Consistent error messages** with better user feedback
- **Type-safe validation** with TypeScript support
- **Flexible configuration** for different validation scenarios

## Key Components

### 1. `ValidationConfigBuilder<T>`
A builder class for creating validation configurations with a fluent API.

### 2. `useFormValidation<T>`
A hook that returns both validation state and appropriate error messages.

### 3. `validateForm<T>`
The core validation function (used internally by the hook).

## Migration Steps

### Step 1: Import the validation utilities

```typescript
import { ValidationConfigBuilder, useFormValidation } from '../../../utils/formValidation';
```

### Step 2: Replace the existing validation logic

**Before:**
```typescript
const isFormValid = useMemo(() => {
  if (!report) return false;
  if (report.images.length < MIN_IMAGES) return false;
  
  const checkFields = (fields: (keyof ReportData)[]) => fields.every(field => {
    const value = report[field];
    return value !== null && value !== undefined && value !== '';
  });
  
  const baseFields: (keyof ReportData)[] = ['field1', 'field2', 'field3'];
  if (!checkFields(baseFields)) return false;
  
  // Conditional validations...
  if (report.someField === SomeEnum.Value) {
    if (!checkFields(['conditionalField'])) return false;
  }
  
  // String validations...
  if (report.status === Status.Hold) {
    if (!report.holdReason || report.holdReason.trim() === '') return false;
  }
  
  return true;
}, [report]);
```

**After:**
```typescript
// Create validation configuration
const validationConfig = useMemo(() => {
  return new ValidationConfigBuilder<ReportData>(
    MIN_IMAGES,
    ['field1', 'field2', 'field3'] // base fields
  )
  .addConditionalFields('someField', SomeEnum.Value, ['conditionalField'])
  .addStringField('status', Status.Hold, 'holdReason')
  .build();
}, []);

// Use the validation hook
const { isValid: isFormValid, errorMessage } = useFormValidation(
  report,
  report?.images || [],
  validationConfig
);
```

### Step 3: Update error message display

**Before:**
```typescript
{!isFormValid && <p className="text-xs text-red-400 text-center mt-2">Please fill all fields and capture at least {MIN_IMAGES} photos to submit.</p>}
```

**After:**
```typescript
{!isFormValid && <p className="text-xs text-red-400 text-center mt-2">{errorMessage}</p>}
```

## Validation Configuration Methods

### `addConditionalFields(conditionField, conditionValue, requiredFields)`
Adds fields that become required when a specific condition is met.

**Example:**
```typescript
.addConditionalFields('officeStatus', OfficeStatus.Opened, [
  'metPerson', 'designation', 'workingPeriod'
])
```

### `addStringField(conditionField, conditionValue, stringField)`
Adds string validation (non-empty after trim) when a condition is met.

**Example:**
```typescript
.addStringField('finalStatus', FinalStatus.Hold, 'holdReason')
.addStringField('nameplate', SightStatus.Sighted, 'nameOnPlate')
```

## Error Messages

The validation hook provides context-specific error messages:

- **No report data**: "Report data is not available."
- **Insufficient images**: "Please capture at least {minImages} photos to submit."
- **Missing fields**: "Please fill all required fields to submit."

## Migration Examples

### Example 1: Simple Form (EntryRestrictedDsaForm)
```typescript
const validationConfig = useMemo(() => {
  return new ValidationConfigBuilder<EntryRestrictedDsaReportData>(
    MIN_IMAGES,
    [
      'addressLocatable', 'addressRating', 'metPerson', 'nameOfMetPerson',
      'metPersonConfirmation', 'officeStatus', 'locality', 'addressStructure',
      'applicantStayingFloor', 'addressStructureColor', 'landmark1', 'landmark2',
      'politicalConnection', 'dominatedArea', 'feedbackFromNeighbour',
      'otherObservation', 'finalStatus'
    ]
  )
  .addStringField('finalStatus', FinalStatus.Hold, 'holdReason')
  .build();
}, []);
```

### Example 2: Complex Form (PositiveResiCumOfficeForm)
```typescript
const validationConfig = useMemo(() => {
  return new ValidationConfigBuilder<ResiCumOfficeReportData>(
    MIN_IMAGES,
    [
      'addressLocatable', 'addressRating', 'resiCumOfficeStatus', 'locality',
      'addressStructure', 'applicantStayingFloor', 'addressStructureColor',
      'doorColor', 'doorNamePlateStatus', 'societyNamePlateStatus',
      'companyNamePlateStatus', 'landmark1', 'landmark2', 'politicalConnection',
      'dominatedArea', 'feedbackFromNeighbour', 'otherObservation', 'finalStatus'
    ]
  )
  .addConditionalFields('resiCumOfficeStatus', ResiCumOfficeStatus.Open, [
    'residenceSetup', 'businessSetup', 'metPerson', 'relation', 'stayingPeriod',
    'stayingStatus', 'companyNatureOfBusiness', 'businessPeriod', 'businessStatus',
    'businessLocation', 'approxArea', 'documentShownStatus', 'tpcMetPerson1',
    'tpcName1', 'tpcConfirmation1', 'tpcMetPerson2', 'tpcName2', 'tpcConfirmation2'
  ])
  .addStringField('businessLocation', BusinessLocation.DifferentAddress, 'businessOperatingAddress')
  .addStringField('documentShownStatus', DocumentShownStatus.Showed, 'documentType')
  .addStringField('doorNamePlateStatus', SightStatus.Sighted, 'nameOnDoorPlate')
  .addStringField('societyNamePlateStatus', SightStatus.Sighted, 'nameOnSocietyBoard')
  .addStringField('companyNamePlateStatus', SightStatus.Sighted, 'nameOnBoard')
  .addStringField('finalStatus', FinalStatus.Hold, 'holdReason')
  .build();
}, []);
```

## Benefits

1. **Reduced Code Duplication**: ~50 lines of validation logic reduced to ~20 lines
2. **Consistent Error Messages**: Standardized user feedback across all forms
3. **Type Safety**: Full TypeScript support with compile-time validation
4. **Maintainability**: Changes to validation logic only need to be made in one place
5. **Testability**: Validation logic can be unit tested independently

## Forms to Migrate

The following forms still need to be migrated to use the new validation system:

### Residence Forms
- `ResidenceForm.tsx`
- `EntryRestrictedResidenceForm.tsx`
- `NspResidenceForm.tsx`
- `ShiftedResidenceForm.tsx`
- `UntraceableResidenceForm.tsx`

### Residence-cum-Office Forms
- `NspResiCumOfficeForm.tsx`
- `ShiftedResiCumOfficeForm.tsx`
- `UntraceableResiCumOfficeForm.tsx`

### Office Forms
- `PositiveOfficeForm.tsx`
- `EntryRestrictedOfficeForm.tsx`
- `NspOfficeForm.tsx`
- `ShiftedOfficeForm.tsx`
- `UntraceableOfficeForm.tsx`

### Business Forms
- `PositiveBusinessForm.tsx`
- `EntryRestrictedBusinessForm.tsx`
- `NspBusinessForm.tsx`
- `ShiftedBusinessForm.tsx`
- `UntraceableBusinessForm.tsx`

### NOC Forms
- `PositiveNocForm.tsx`
- `EntryRestrictedNocForm.tsx`
- `NspNocForm.tsx`
- `UntraceableNocForm.tsx`

### DSA/DST Forms
- `PositiveDsaForm.tsx`
- `NspDsaForm.tsx`
- `ShiftedDsaForm.tsx`
- `UntraceableDsaForm.tsx`

### Builder Forms
- `PositiveBuilderForm.tsx`
- `EntryRestrictedBuilderForm.tsx`
- `NspBuilderForm.tsx`
- `ShiftedBuilderForm.tsx`
- `UntraceableBuilderForm.tsx`

### Property Forms
- `PositivePropertyApfForm.tsx`
- `EntryRestrictedPropertyApfForm.tsx`
- `NspPropertyApfForm.tsx`
- `UntraceablePropertyApfForm.tsx`
- `PositivePropertyIndividualForm.tsx`
- `EntryRestrictedPropertyIndividualForm.tsx`
- `NspPropertyIndividualForm.tsx`
- `UntraceablePropertyIndividualForm.tsx`

Each form follows a similar pattern and can be migrated using the steps outlined above.
