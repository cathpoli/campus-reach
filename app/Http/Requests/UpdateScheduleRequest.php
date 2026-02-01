<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;

class UpdateScheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date' => ['sometimes', 'date', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => [
                'required',
                'date_format:H:i',
                'after:start_time',
            ],
            'duration' => ['required', 'integer', 'min:15', 'max:480'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'date.required' => 'Please select a date.',
            'date.date' => 'Please provide a valid date.',
            'date.after_or_equal' => 'The date cannot be in the past.',
            
            'start_time.required' => 'Please select a start time.',
            'start_time.date_format' => 'Start time must be in HH:MM format.',
            
            'end_time.required' => 'Please select an end time.',
            'end_time.date_format' => 'End time must be in HH:MM format.',
            'end_time.after' => 'End time must be after start time.',
            
            'duration.required' => 'Please specify the duration.',
            'duration.integer' => 'Duration must be a number.',
            'duration.min' => 'Duration must be at least 15 minutes.',
            'duration.max' => 'Duration cannot exceed 8 hours (480 minutes).',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validate that the duration matches the time difference
            if ($this->start_time && $this->end_time) {
                $start = Carbon::createFromFormat('H:i', $this->start_time);
                $end = Carbon::createFromFormat('H:i', $this->end_time);
                $calculatedDuration = $start->diffInMinutes($end);

                if ($this->duration != $calculatedDuration) {
                    $validator->errors()->add(
                        'duration',
                        "Duration ({$this->duration} min) doesn't match the time range ({$calculatedDuration} min)."
                    );
                }
            }

            // Validate that the schedule is not in the past
            if ($this->date && $this->start_time) {
                $scheduleDateTime = Carbon::parse($this->date . ' ' . $this->start_time);
                
                if ($scheduleDateTime->isPast()) {
                    $validator->errors()->add(
                        'start_time',
                        'The schedule time cannot be in the past.'
                    );
                }
            }
        });
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'date' => 'date',
            'start_time' => 'start time',
            'end_time' => 'end time',
            'duration' => 'duration',
        ];
    }
}