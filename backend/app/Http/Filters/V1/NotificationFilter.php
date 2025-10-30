<?php

namespace App\Http\Filters\V1;

class NotificationFilter extends QueryFilter
{

  public function user($value)
  {
    return $this->builder->whereIn("author_id", explode(',', $value));
  }

  public function isRead($value)
  {
    return $this->builder->whereIn("is_read", explode(',', $value));
    // ?filter[isRead]=1 for true
  }

  public function content($value)
  { // we search for existing word in the content, no matter his placement in the text

    $likeStr = str_replace('*', '%', $value); // we replace *...* in the url with %...% bc that's what we need in the like query

    return $this->builder->where('content', 'like', $likeStr); // explanation : we use the like operator to search for a string in the content column of the document table. The % wildcard is used to match any number of characters, so this will match any content that contains the string we are searching for. For example, if we search for "*test*", it will match "test", "testing", "my test", etc
    // ?filter[content]=*fir*
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
    'content',
    'isRead' => 'is_read',
    'createdAt' => 'created_at', // json => DB (the wring difference)
    'updatedAt' => 'updated_at',
  ]; // these are the things that the user can sort with


}
