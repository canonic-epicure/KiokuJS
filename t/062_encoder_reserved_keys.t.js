StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Collapser setup')
    
    var backend     = new KiokuJS.Backend.Hash({
        resolver            : new KiokuJS.Resolver.Standard()
    })
    
    var scope       = new KiokuJS.Scope({
        backend     : backend
    })
    
    var collapser = new KiokuJS.Collapser({
        scope       : scope
    })
    
    t.ok(collapser, "KiokuJS collapser was instantiated")
        

        
    Class('Some.Class', {
        
        has : {
            $ref    : null,
            $entry  : null
        }
    })

        
    //======================================================================================================================================================================================================================================================
    t.diag('Graph setup')
    
    var instance = new Some.Class()
    
    instance.$ref   = instance
    instance.$entry = {
        $ref    : [ '$ref' ],
        $entry  : 123
    }
        
        
    //======================================================================================================================================================================================================================================================
    t.diag('Collapsing')

    var nodes = collapser.collapse({}, [ instance ])
    
    t.ok(nodes.length == 1, 'Correct number of nodes was returned')
        
    Joose.A.each(nodes, scope.pinNode, scope)
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Setting up nodes & entries')
    
    var instanceNode           = scope.objectToNode(instance)
    var instanceEntry          = backend.encodeNode(instanceNode)
    var instanceData           = instanceEntry.data
        
    
    t.ok(instanceEntry.$entry, "Instance entry is marked with $entry")
    t.ok(instanceData[ 'public:$ref' ].$ref == instanceNode.ID, 'Correctly encoded reference to itself')
    
    
    
    var inner$EntryData = instanceData[ 'public:$entry' ]
    
    t.ok(inner$EntryData[ 'public:$ref' ][ 0 ] == '$ref', '`instance.$entry.$ref` has correct value')
    t.ok(inner$EntryData[ 'public:$entry' ] == 123, '`instance.$entry.$entry` has correct value')
    
    
    t.done()
})    