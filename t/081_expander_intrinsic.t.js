StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS.Test.ValueWrapper', 'KiokuJS.Test.TypeMap.ValueWrapper' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS,                   "'KiokuJS' is here")
        t.ok(KiokuJS.Collapser,         "'KiokuJS.Collapser' is here")
        t.ok(KiokuJS.Linker.Expander,   "'KiokuJS.Linker.Expander' is here")
        t.ok(KiokuJS.Test.ValueWrapper, "'KiokuJS.Test.ValueWrapper' is here")


        //======================================================================================================================================================================================================================================================
        t.diag('Graph setup')
        
        
        var value = new KiokuJS.Test.ValueWrapper({ value : 'someValue' })
        
        var array = [ value, value ]
        
        var graph = {
            data1 : value,
            data2 : array
        }
        
        //======================================================================================================================================================================================================================================================
        t.diag('Collapser setup')
        
        var backend     = new KiokuJS.Backend.Hash({
            resolver            : new KiokuJS.Resolver.Standard([
                {
                    meta : 'KiokuJS.Test.TypeMap.ValueWrapper'
                }
            ])
        })
        
        var scope       = new KiokuJS.Scope({
            backend     : backend
        })
        
        var collapser = new KiokuJS.Collapser({
            scope       : scope
        })
        
        t.ok(collapser, "KiokuJS collapser was instantiated")

        
        //======================================================================================================================================================================================================================================================
        t.diag('Extracting first-class nodes from graph')
        
        var nodes = collapser.collapse({}, [ graph, array ])
        
        t.ok(nodes.length == 2, 'Correct number of nodes is returned')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Setting up nodes & entries')
        
        var graphID             = nodes[ 0 ].ID
        var arrayID             = nodes[ 1 ].ID
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Round-triping nodes')
        
        var roundTrip = function (scope, backend, nodes) {
            
            var strings = backend.serialize(scope.encodeNodes(nodes))
            var nodes   = scope.decodeEntries(backend.deserialize(strings))
            
            return nodes
        }
        
        
        var nodes2          = roundTrip(scope, backend, nodes)
        var nodesByID       = {}
        
        Joose.A.each(nodes2, function (node) {
            t.ok(!node.isLive(), 'Round-tripped nodes have no objects')
            
            nodesByID[ node.ID ] = node
        })
        

        
        //======================================================================================================================================================================================================================================================
        t.diag('Animating nodes')
        
        var linker = new KiokuJS.Linker({
            nodes   : nodesByID,
            scope   : scope
        })
        
        linker.animateNodes()
        
        var graph2      = scope.idToObject(graphID)
        var array2      = scope.idToObject(arrayID)
        
        t.ok(graph2 != graph && array2 != array, 'New objects were created')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Checking newly created objects')
        
        t.isaOk(graph2, Object, 'Correct class for `graph2`')
        t.isaOk(array2, Array, 'Correct class for `array2`')
        
        t.ok(graph2.data2 == array2, 'Correct reference to 1st class objects')
        
        
        var value1      = graph2.data1
        var value2      = array2[0]
        var value3      = array2[1]
        
        t.isaOk(value1, KiokuJS.Test.ValueWrapper, 'Correct class for `value1`')
        t.isaOk(value2, KiokuJS.Test.ValueWrapper, 'Correct class for `value2`')
        t.isaOk(value3, KiokuJS.Test.ValueWrapper, 'Correct class for `value3`')
        
        
        t.ok(value1 != value2 && value2 != value3, 'All values are different')
        
        t.ok(value1.value == 'someValue', 'Correct value for `value1` instance')
        t.ok(value2.value == 'someValue', 'Correct value for `value2` instance')
        t.ok(value3.value == 'someValue', 'Correct value for `value3` instance')
        
        
        t.done()
        
        t.endAsync(async0)
    })
})    
