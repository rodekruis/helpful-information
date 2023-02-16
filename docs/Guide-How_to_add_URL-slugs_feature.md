# Guide: How to add URL-slugs feature

## Add Slugs to Sheets

1.  Start with "**Categories**"-sheet

2.  Add new column (within 'known' range)

3.  Reorder column(s) to preferred position.

4.  Set whole column font to `Roboto Mono`

5.  Add input/data validation to whole column:

    - Range: (CHANGE COLUMN-LETTER "C"!)

          Categories!C2:C98

    - Custom Formula: (CHANGE COLUMN-LETTER "C"!)

          =REGEXMATCH(C2; "^[a-z0-9]+(?:-[a-z0-9]+)*$")

    - Warning:

          The URL can only contain: lowercase "a-z", 0-9, separated by "-" characters.

6.  Set conditional formatting to highlight non-unique slugs:

    - Range: (CHANGE COLUMN-LETTER "C"!)

          Categories!C2:C98

    - Custom Formula: (CHANGE COLUMN-LETTER "C"!)

          =COUNTIF($C$2:$C2;$C2)>1

    - Set cell-style/format to "warning"/"red"

7.  Repeat step 2 - 6 for "**Sub-Categories**"-sheet

8.  Repeat step 2 - 4 for "**Offers**"-sheet

9.  Repeat step 2 - 4 for "**Q&As**"-sheet

10. Override ALL Slug-column-header(s) with other header and set to: (from Formula-bar!)

    ```txt

    Unique URL (only "a-z 0-9" or "-")
    #SLUG

    ```
