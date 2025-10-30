<?php

namespace App\Http\Filters\V1;

use Illuminate\Database\Eloquent\Builder; // make sure it is from \Eloquent
use Illuminate\Http\Request;

abstract class QueryFilter
{
  protected $builder;
  protected $request;

  public function __construct(Request $request)
  { // we need this to prevent the request error in the foreach
    // constructor will be called automatically when calling the object
    $this->request = $request;
  }

  protected function filter($arr)
  { // this will go through all the filter[] in the url
    foreach ($arr as $key => $value) {
      if (method_exists($this, $key)) {
        $this->$key($value);
      }
    }
    return $this->builder;
  }
  // * with this filter method we write like this :
  // localhost:8800/api/v1/docs?filter[docStatut]=2&include=author
  // * without this method it will be like this :
  // localhost:8800/api/v1/docs?docStatut=2&include=author
  // * this will help with defrenciate between filters and includes // if we add include

  public function apply(Builder $builder)
  {
    $this->builder = $builder;

    foreach ($this->request->all() as $key => $value) {
      if (method_exists($this, $key)) {
        // if the method exists on this object and the method name is the key, we call that method and we pass the value
        $this->$key($value);
      }
    }
    return $this->builder;
  }


  // ! sort :
  protected $sortable = [];
  protected function sort($value)
  {
    $sortAttributes = explode(',', $value); // we put out comma separated query to an array

    foreach ($sortAttributes as $sortAttribute) {
      $direction = 'asc'; // for ascending by default

      if (strpos($sortAttribute, '-') === 0) { // if the first character of the string is - (at position 0)
        $direction = 'desc'; // for descending
        $sortAttribute = substr($sortAttribute, 1); // this will remove the '-' from the string (the query we entered in the uri)
      }

      // we check if our sorted attribute is in our sorted array in the DocumentFilter
      if (! in_array($sortAttribute, $this->sortable) && ! array_key_exists($sortAttribute, $this->sortable)) { // sortable is in the ...Filter.php
        // check the key for createdAt and updatedAt bc we have them like this 'created_at' in the DB
        continue; // if not in array -> continue
      } // now when the user tries to sort by somthing that is not in the sortable array, we just skip it and continue to the next one

      // we added this for the createdAt => created_at (the different writing in json => DB)
      $columnName = $this->sortable[$sortAttribute] ?? null;
      if ($columnName === null) {
        $columnName = $sortAttribute;
      }

      $this->builder->orderBy($columnName, $direction);
    }
  }
}
