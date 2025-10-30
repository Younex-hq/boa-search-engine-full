<?php

namespace App\Traits;

use GrahamCampbell\ResultType\Success;

trait ApiResponses
{
  protected function ok($message, $data = [])
  {
    return $this->success($message, $data, 200);
  }


  protected function success($message, $data = [], $statusCode = 200) // default is ok 200, data is for the Auth token
  {
    // we call this anytime the "success" is succesful
    // successful requists can be 200, 304...
    return response()->json([
      'data' => $data,
      'message' => $message,
      'status' => $statusCode,
    ], $statusCode);
  }

  protected function error($message, $statusCode, $data = [])
  {
    return response()->json([
      'message' => $message,
      'status' => $statusCode,
      'data' => $data,
    ], $statusCode);
  }
}
