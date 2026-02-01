<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Allow all authenticated users, adjust as needed
    }

    public function rules()
    {
        $userId = $this->user()->id;

        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'extension' => 'nullable|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $userId,
            'student_number' => 'nullable|string|max:255',
            'employee_number' => 'nullable|string|max:255',
            'contact_number' => 'required|string|max:255',
            'gender' => 'required|string|in:Male,Female',
        ];
    }
}