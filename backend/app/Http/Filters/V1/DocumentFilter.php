<?php

namespace App\Http\Filters\V1;

class DocumentFilter extends QueryFilter
{

  public function user($value)
  {
    return $this->builder->whereIn("user_id", explode(',', $value));
    // api/v1/docs?filter[user]=2
  }

  public function docType($value)
  {
    return $this->builder->whereIn("doc_type_id", explode(',', $value)); // the values are separated by ,
    // example : filter[status]=X,C  for canceled and completed
    // the builder is in Document.php model scopeFilter method
    // ?filter[docType]=1 for New
  }

  public function docStatut($value)
  {
    return $this->builder->whereIn("doc_statut_id", explode(',', $value));
    // ?filter[docStatus]=1 for Note
  }


  public function isActive($value)
  {
    return $this->builder->where("is_active", $value);
    // ?filter[isActive]=1 or 0
  }

  public function direction($value)
  {
    return $this->builder->whereIn("direction_id", explode(',', $value));
  }

  public function docCreationDate($value)
  {
    $dates = explode(',', $value);

    if (count($dates) > 1) { // if we have more than 1 date then it is a range that we have to filter
      return $this->builder->whereBetween('document_creation_date', $dates);
    }

    $date = $dates[0];

    // If the format is Y-m-d (e.g., 2025-04-15), filter for the entire month
    // and prioritize the specific day, then the previous day, in the sort order.
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
      list($year, $month) = explode('-', $date);
      // Calculate the previous day
      $previousDay = date('Y-m-d', strtotime($date . ' -1 day'));

      return $this->builder
        ->whereYear('document_creation_date', $year)
        ->whereMonth('document_creation_date', $month)
        // Order by the specific day, then the previous day, then the rest of the month
        ->orderByRaw("CASE WHEN DATE(document_creation_date) = ? THEN 0 WHEN DATE(document_creation_date) = ? THEN 1 ELSE 2 END, document_creation_date DESC", [$date, $previousDay]);
    }

    // If the format is Y-m (e.g., 2025-04), filter for the entire month.
    if (preg_match('/^\d{4}-\d{2}$/', $date)) {
      list($year, $month) = explode('-', $date);
      return $this->builder->whereYear('document_creation_date', $year)
        ->whereMonth('document_creation_date', $month);
    }

    // Fallback for a single date filter.
    return $this->builder->whereDate('document_creation_date', $date);
    // * localhost:8800/api/v1/docs?filter[docCreationDate]=2025-09-01
    // * localhost:8800/api/v1/docs?filter[docCreationDate]=2025-09
    // * localhost:8800/api/v1/docs?filter[docCreationDate]=2020-01-01,2025-09-01
    // this will return all the documents of the specific day, followed by the documents of the previous day, followed by the documents of the specific month
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
    'title',
    'docType' => 'doc_type_id',
    'docStatut' => 'doc_statut_id',
    'docCreationDate' => 'document_creation_date',
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
