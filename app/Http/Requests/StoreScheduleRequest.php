<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreScheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only teachers can create schedules
        return $this->user() && $this->user()->role === 'teacher';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date' => 'sometimes|date|after_or_equal:today',
            'start_date_time' => 'sometimes|date',
            'end_date_time' => 'sometimes|date|after:start_date_time',
            'duration' => 'nullable|integer|min:1|max:480',
            'status' => 'nullable|in:available,booked,cancelled',
        ];
    }

    /**
     * Get custom error messages
     */
    public function messages(): array
    {
        return [
            'date.after_or_equal' => 'Schedule date must be today or a future date.',
            'end_date_time.after' => 'End time must be after the start time.',
            'duration.min' => 'Duration must be at least 1 minute.',
            'duration.max' => 'Duration cannot exceed 8 hours (480 minutes).',
            'status.in' => 'Invalid status. Must be available, booked, or cancelled.',
        ];
    }
}
