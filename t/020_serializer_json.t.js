StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(KiokuJS.Serializer.JSON, "KiokuJS.Serializer.JSON is here")

    var serializer = KiokuJS.Serializer.JSON
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Basics')
    
    t.ok(serializer.serialize(false) == 'false', 'Boolean value serialized ok #1')
    t.ok(serializer.serialize(true) == 'true', 'Boolean value serialized ok #2')
    
    t.ok(serializer.serialize('yo') == '"yo"', 'String value serialized ok #1')
    t.ok(serializer.serialize('y\\o') == '"y\\o"', 'String value serialized ok #2')
    t.ok(serializer.serialize('""') == '"\\"\\""', 'String value serialized ok #3')
    
    t.ok(serializer.serialize('foo\nbar') == '"foo\\nbar"', 'String value serialized ok #4')
    
    t.ok(serializer.serialize(2)    === "2", 'Number value serialized ok #1')
    t.ok(serializer.serialize(4.5)  === "4.5", 'Number value serialized ok #2')
    
    t.ok(serializer.serialize(null)  === "null", '`null` value serialized ok')
    t.ok(serializer.serialize(undefined)  === "null", '`undefined` value serialized ok')
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Array')
    
    t.ok(serializer.serialize([]) == '[]', 'Empty array serialized ok')
    t.ok(serializer.serialize([ 1, 2, 3 ]) == '[1,2,3]', 'Array serialized ok')
    
    //======================================================================================================================================================================================================================================================
    t.diag('Nested array')
    
    t.ok(serializer.serialize([ [], [] ]) == '[[],[]]', 'Nested array serialized ok #1')
    t.ok(serializer.serialize([ [ 1, 2 ], [ 3 ] ]) == '[[1,2],[3]]', 'Nested array serialized ok #2')

    //======================================================================================================================================================================================================================================================
    t.diag('Objects')
    
    t.ok(serializer.serialize({}) == '{}', 'Empty object serialized ok')
    t.ok(serializer.serialize({ foo : 'bar', bar : [ 'baz', 'zab' ]}) == '{"foo":"bar","bar":["baz","zab"]}', 'Object serialized ok')
    
    t.ok(serializer.serialize({ a : undefined }) == '{"a":null}', '"Undefined" entry seriazlied as `null`')

    
    //======================================================================================================================================================================================================================================================
    t.diag('Repeating objects')
    
    var obj = { foo : 'bar' }
    
    t.ok(serializer.serialize([ obj, obj ]) == '[{"foo":"bar"},{"foo":"bar"}]', 'Repeating objects serialized ok')
    
        
    t.done()
})    