<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApiLoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use App\Traits\ApiResponses;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    use ApiResponses;

    public function login(ApiLoginRequest $request)
    {
        // if the data is valid, we authenticate the user
        if (! Auth::attempt($request->validated())) {
            return $this->error("Identifiants invalides, veuillez vérifier votre e-mail et mot de passe.", 401);
        }

        // if authentication is successful we fetch the user from the database
        $user = Auth::user();

        // Check if the user is active
        if (! $user->is_active) {
            return $this->error("Votre compte est inactif. Veuillez contacter un administrateur.", 403);
        }

        // Define abilities based on user role
        $abilities = [
            'document:view',
            'document:create',
        ];

        // Add admin-specific abilities
        if ($user->is_admin) {
            $abilities = array_merge($abilities, [
                'document:update-any',
                'document:delete-any',
                'document:update-own', // admin can update any including his own, this line just for making sure
                'document:delete-own', // just for making sure
                'user:manage',
                'direction:manage',
                'location:manage',
                'docType:manage',
                'docStatut:manage',
            ]);
        } else {
            $abilities = array_merge($abilities, [
                'document:update-own',
                'document:delete-own',
            ]);
        }

        return $this->ok('Authenticated', [
            'token' => $user->createToken(
                "API Token for {$user->email}",
                $abilities, // Grant abilities based on user role
                now()->addMinutes(60) // expiration time for the token : 60 minutes
                // now()->addMonth()
            )->plainTextToken,
            'user' => $user
        ]);
    }
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return $this->ok('');
    }

    public function index() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
