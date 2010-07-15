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
    
    var instanceNode            = scope.objectToNode(instance)
    
    var scope2       = new KiokuJS.Scope({
        backend     : backend
    })
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Round-triping nodes')
    
    var nodes2           = backend.deserializeNodes(backend.serializeNodes(nodes))
    
    Joose.A.each(nodes2, function (node) {
        t.ok(!node.isLive(), 'Round-tripped nodes have no objects')
    })
    
    Joose.A.each(nodes2, scope2.pinNode, scope2)
    

    //======================================================================================================================================================================================================================================================
    t.diag('Animating nodes')
    
    KiokuJS.Linker.Expander.expandNodes(nodes2, scope2)
    
    var instance2      = scope2.idToObject(instanceNode.ID)
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Checking newly created objects')
    
    t.isaOk(instance2, Some.Class, 'Correct class for `instance2`')
    
    t.ok(instance2.$ref == instance2, 'Correct self-reference')
    
    t.ok(instance2.$entry.$ref[0] == '$ref', 'Correct inner value #1')
    t.ok(instance2.$entry.$entry == 123, 'Correct inner value #2')
    
    
    t.done()
})    