<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Traits\ApiResponses;

class ApiController extends Controller
{
  use ApiResponses; // for post request

  public function include(string $relationship): bool
  {
    $param = request()->get('include'); // we get the include parameter from the request ( the url : ?include=author )

    if (! isset($param)) { // check if it's null
      return false; // if we don't have the parameter we do nothing
    }


    $includeValues = explode(',', strtolower($param)); // separate request parameters by ',' and turn to array

    return in_array(strtolower($relationship), $includeValues); // if the provided relationship (we sent as a parameter to the iclude() ) is in the array of the array of values that the user entered in the url we return yes
  }
}
