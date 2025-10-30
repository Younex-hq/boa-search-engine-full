<?php

namespace App\Http\Filters\V1;

class UserFilter extends QueryFilter
{
  public function user($value)
  {
    return $this->builder->whereIn("user_id", explode(',', $value));
  }

  public function isAdmin($value)
  {
    return $this->builder->whereIn("is_admin", explode(',', $value));
    // ?filter[isAdmin]=1 to show only admins
  }

  public function isActive($value)
  {
    return $this->builder->whereIn("is_active", explode(',', $value));
  }

  public function direction($value)
  {
    return $this->builder->whereIn("direction_id", explode(',', $value));
  }


  public function createdAt($value)
  {
    $dates = explode(',', $value);

    if (count($dates) > 1) { // if we have more that 1 date then it is a range that we have to filter
      return $this->builder->whereBetween('created_at', $dates);
    }

    return $this->builder->whereDate('created_at', $value); // only 1 date
  }

  public function updatedAt($value)
  { // same as the createdAt but for the updates
    $dates = explode(',', $value);

    if (count($dates) > 1) {
      return $this->builder->whereBetween('updated_at', $dates);
    }

    return $this->builder->whereDate('updated_at', $value);
  }

  // ! sort :
  protected $sortable = [
    'email',
    'firstName' => 'first_name', // sorted by location id not alphabiticly
    'lastName' => 'last_name',
    'isAdmin' => 'is_admin',
    'isActive' => 'is_active',
    'createdAt' => 'created_at', // json => DB (the wring difference)
    'updatedAt' => 'updated_at',
  ]; // these are the things that the user can sort with


  /*
public function title($value)
{ // we saerch for existing word in the title, no matter his placement in the text

  $likeStr = str_replace('*', '%', $value); // we replace *...* in the url with %...% bc that's what we need in the like query

  return $this->builder->where('title', 'like', $likeStr); // explanation : we use the like operator to search for a string in the title column of the document table. The % wildcard is used to match any number of characters, so this will match any title that contains the string we are searching for. For example, if we search for "*test*", it will match "test", "testing", "my test", etc
}
*/

  // public function include($value)
  // {
  //   return $this->builder->with($value); // with this we can use include in the url
  // }
}
