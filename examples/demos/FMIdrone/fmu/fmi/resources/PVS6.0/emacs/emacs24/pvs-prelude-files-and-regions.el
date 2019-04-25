;;; Generated from pvs-set-prelude-info.el - do not edit
(defvar *prelude-files-and-regions*
  (mapcar
      '(lambda (x)
	 (cons (format "%s/lib/%s" pvs-path (car x)) (cdr x)))
    '(("character_adt.pvs" ("character_adt" 1 2526) ("character_adt_reduce" 2526 3217)) ("lift_adt.pvs" ("lift_adt" 1 3093) ("lift_adt_map" 3093 3571) ("lift_adt_reduce" 3571 4348)) ("list_adt.pvs" ("list_adt" 1 4282) ("list_adt_map" 4282 4943) ("list_adt_reduce" 4943 5854)) ("ordstruct_adt.pvs" ("ordstruct_adt" 1 3762) ("ordstruct_adt_reduce" 3762 4843)) ("prelude.pvs" ("booleans" 1 2443) ("equalities" 2443 2656) ("notequal" 2656 2780) ("if_def" 2780 3060) ("boolean_props" 3060 4115) ("xor_def" 4115 4419) ("quantifier_props" 4419 5416) ("defined_types" 5416 5718) ("exists1" 5718 6335) ("equality_props" 6335 6806) ("if_props" 6806 7177) ("functions" 7177 8725) ("functions_alt" 8725 8954) ("transpose" 8954 9102) ("restrict" 9102 9791) ("restrict_props" 9791 10192) ("extend" 10192 10588) ("extend_bool" 10588 10851) ("extend_props" 10851 11251) ("extend_func_props" 11251 11841) ("K_conversion" 11841 12075) ("K_props" 12075 12283) ("identity" 12283 12641) ("identity_props" 12641 12878) ("relations" 12878 14044) ("orders" 14044 17401) ("orders_alt" 17401 17940) ("restrict_order_props" 17940 19985) ("extend_order_props" 19985 20747) ("wf_induction" 20747 21091) ("measure_induction" 21091 21528) ("epsilons" 21528 22183) ("sets" 22183 25262) ("sets_lemmas" 25262 34275) ("function_inverse_def" 34275 38976) ("function_inverse" 38976 41126) ("function_inverse_alt" 41126 42470) ("function_image" 42470 44068) ("function_props" 44068 45287) ("function_props_alt" 45287 45900) ("function_props2" 45900 46243) ("relation_defs" 46243 47730) ("relation_props" 47730 48315) ("relation_props2" 48315 48515) ("relation_converse_props" 48515 50315) ("indexed_sets" 50315 51187) ("operator_defs" 51187 52032) ("numbers" 52032 52362) ("number_fields" 52362 54137) ("reals" 54137 55856) ("real_axioms" 55856 56673) ("bounded_real_defs" 56673 58259) ("bounded_real_defs_alt" 58259 58767) ("real_types" 58767 60988) ("rationals" 60988 64430) ("integers" 64430 68813) ("naturalnumbers" 68813 71025) ("min_nat" 71025 71330) ("real_defs" 71330 75505) ("real_props" 75505 88772) ("extra_real_props" 88772 98192) ("extra_tegies" 98192 98765) ("rational_props" 98765 99321) ("integer_props" 99321 100010) ("floor_ceil" 100010 102309) ("exponentiation" 102309 108986) ("euclidean_division" 108986 110028) ("divides" 110028 112520) ("modulo_arithmetic" 112520 116025) ("subrange_inductions" 116025 116670) ("bounded_int_inductions" 116670 117454) ("bounded_nat_inductions" 117454 118277) ("subrange_type" 118277 118390) ("int_types" 118390 118600) ("nat_types" 118600 118806) ("nat_fun_props" 118806 120507) ("finite_sets" 120507 128807) ("restrict_set_props" 128807 129300) ("extend_set_props" 129300 131356) ("function_image_aux" 131356 132262) ("function_iterate" 132262 133089) ("sequences" 133089 134548) ("seq_functions" 134548 134870) ("finite_sequences" 134870 136730) ("more_finseq" 136730 137192) ("ordstruct" 137192 137400) ("ordinals" 137400 139272) ("lex2" 139272 139780) ("list" 139780 139924) ("list_props" 139924 142124) ("map_props" 142124 142508) ("more_map_props" 142508 142758) ("filters" 142758 143655) ("list2finseq" 143655 144205) ("list2set" 144205 144462) ("disjointness" 144462 145064) ("character" 145064 146389) ("strings" 146389 148166) ("lift" 148166 148246) ("union" 148246 148341) ("mucalculus" 148341 149601) ("ctlops" 149601 150336) ("fairctlops" 150336 151631) ("Fairctlops" 151631 153039) ("bit" 153039 153685) ("bv" 153685 154495) ("exp2" 154495 155237) ("bv_concat_def" 155237 155890) ("bv_bitwise" 155890 157016) ("bv_nat" 157016 160147) ("empty_bv" 160147 160252) ("bv_caret" 160252 162049) ("mod" 162049 165894) ("bv_arith_nat_defs" 165894 168521) ("bv_int_defs" 168521 169851) ("bv_arithmetic_defs" 169851 171739) ("bv_extend_defs" 171739 174153) ("infinite_sets_def" 174153 176183) ("finite_sets_of_sets" 176183 178699) ("EquivalenceClosure" 178699 179638) ("QuotientDefinition" 179638 180936) ("KernelDefinition" 180936 181570) ("QuotientKernelProperties" 181570 182355) ("QuotientSubDefinition" 182355 182674) ("QuotientExtensionProperties" 182674 183351) ("QuotientDistributive" 183351 185848) ("QuotientIteration" 185848 186629) ("PartialFunctionDefinitions" 186629 188158) ("PartialFunctionComposition" 188158 189058) ("stdlang" 189058 189519) ("stdexc" 189519 189789) ("stdcatch" 189789 190736) ("stdprog" 190736 192043) ("stdglobal" 192043 192167) ("stdpvs" 192167 192542) ("stdstr" 192542 195463) ("stdio" 195463 202760) ("stdmath" 202760 204373) ("stdfmap" 204373 205431) ("stdindent" 205431 206669) ("stdtokenizer" 206669 215030) ("stdpvsio" 215030 215288) ("stdsys" 215288 217370)) ("union_adt.pvs" ("union_adt" 1 3788) ("union_adt_map" 3788 4555) ("union_adt_reduce" 4555 5471)))))
