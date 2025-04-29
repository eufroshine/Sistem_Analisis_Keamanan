(module
  ;; Import the JavaScript memory
  (import "env" "memory" (memory 1))
  
  ;; Import JavaScript functions we might need
  (import "env" "consoleLog" (func $consoleLog (param i32 i32)))
  
  ;; Define constants for attack types
  (global $ATTACK_SQL i32 (i32.const 1))
  (global $ATTACK_XSS i32 (i32.const 2))
  (global $ATTACK_DOS i32 (i32.const 3))
  (global $ATTACK_BRUTE i32 (i32.const 4))
  (global $ATTACK_CSRF i32 (i32.const 5))
  (global $ATTACK_FILE i32 (i32.const 6))
  (global $ATTACK_COMMAND i32 (i32.const 7))
  
  ;; Define constants for severity levels
  (global $SEVERITY_LOW i32 (i32.const 1))
  (global $SEVERITY_MEDIUM i32 (i32.const 2))
  (global $SEVERITY_HIGH i32 (i32.const 3))
  (global $SEVERITY_CRITICAL i32 (i32.const 4))
  
  ;; Helper function: calculate a base threat score for an attack type
  (func $calculateBaseThreatScore (param $attackType i32) (result i32)
    (local $score i32)
    
    ;; Set default score
    (local.set $score (i32.const 30))
    
    ;; Determine score based on attack type
    (block $end
      (block $default
        (block $command
          (block $file
            (block $csrf
              (block $brute
                (block $dos
                  (block $xss
                    (block $sql
                      (br_table $sql $xss $dos $brute $csrf $file $command $default (i32.sub (local.get $attackType) (i32.const 1)))
                    ) ;; SQL Injection
                    (local.set $score (i32.const 70))
                    (br $end)
                  ) ;; XSS
                  (local.set $score (i32.const 60))
                  (br $end)
                ) ;; DoS
                (local.set $score (i32.const 80))
                (br $end)
              ) ;; Brute Force
              (local.set $score (i32.const 50))
              (br $end)
            ) ;; CSRF
            (local.set $score (i32.const 40))
            (br $end)
          ) ;; File Inclusion
          (local.set $score (i32.const 75))
          (br $end)
        ) ;; Command Injection
        (local.set $score (i32.const 90))
        (br $end)
      ) ;; Default case
      (local.set $score (i32.const 30))
    )
    
    ;; Return the calculated score
    (local.get $score)
  )
  
  ;; Helper function: adjust score based on severity
  (func $adjustScoreBySeverity (param $score i32) (param $severity i32) (result i32)
    (local $adjustedScore i32)
    
    ;; Set default adjusted score
    (local.set $adjustedScore (local.get $score))
    
    ;; Adjust based on severity
    (block $end
      (block $default
        (block $critical
          (block $high
            (block $medium
              (block $low
                (br_table $low $medium $high $critical $default (i32.sub (local.get $severity) (i32.const 1)))
              ) ;; Low severity
              (local.set $adjustedScore (i32.div_u (local.get $score) (i32.const 2)))
              (br $end)
            ) ;; Medium severity
            ;; No adjustment for medium (multiplier of 1)
            (br $end)
          ) ;; High severity
          (local.set $adjustedScore (i32.div_u (i32.mul (local.get $score) (i32.const 3)) (i32.const 2)))
          (br $end)
        ) ;; Critical severity
        (local.set $adjustedScore (i32.mul (local.get $score) (i32.const 2)))
        (br $end)
      ) ;; Default case
      ;; No adjustment
    )
    
    ;; Ensure the score doesn't exceed 100
    (if (i32.gt_u (local.get $adjustedScore) (i32.const 100))
      (then (local.set $adjustedScore (i32.const 100)))
    )
    
    ;; Return the adjusted score
    (local.get $adjustedScore)
  )

  ;; Main function to analyze an attack
  ;; Parameters:
  ;; - attackType: i32
  ;; - severity: i32
  ;; - patternMatches: i32 (bitfield for detected patterns)
  (func $analyzeAttack (export "analyzeAttack") (param $attackType i32) (param $severity i32) (param $patternMatches i32) (result i32)
    (local $score i32)
    
    ;; Calculate base score by attack type
    (local.set $score (call $calculateBaseThreatScore (local.get $attackType)))
    
    ;; Adjust score by severity
    (local.set $score (call $adjustScoreBySeverity (local.get $score) (local.get $severity)))
    
    ;; Adjust score based on pattern matches (each bit in patternMatches represents a pattern)
    ;; Check bit 0 (Known TOR exit node)
    (if (i32.and (local.get $patternMatches) (i32.const 1))
      (then
        (local.set $score (i32.add (local.get $score) (i32.const 15)))
      )
    )
    
    ;; Check bit 1 (Previously flagged IP)
    (if (i32.and (local.get $patternMatches) (i32.const 2))
      (then
        (local.set $score (i32.add (local.get $score) (i32.const 15)))
      )
    )
    
    ;; Check bit 2 (Signature matching)
    (if (i32.and (local.get $patternMatches) (i32.const 4))
      (then
        (local.set $score (i32.add (local.get $score) (i32.const 15)))
      )
    )
    
    ;; Check bit 3 (Behavioral anomaly)
    (if (i32.and (local.get $patternMatches) (i32.const 8))
      (then
        (local.set $score (i32.add (local.get $score) (i32.const 15)))
      )
    )
    
    ;; Ensure the score doesn't exceed 100
    (if (i32.gt_u (local.get $score) (i32.const 100))
      (then (local.set $score (i32.const 100)))
    )
    
    ;; Return the final threat score
    (local.get $score)
  )
)